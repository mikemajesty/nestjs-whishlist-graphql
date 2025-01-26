import { RequestMethod, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';
import { bold } from 'colorette';
import compression from 'compression';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import { ILoggerAdapter } from '@/infra/logger/adapter';
import { ISecretsAdapter } from '@/infra/secrets';
import { ExceptionHandlerFilter } from '@/middlewares/filters/exception-handler.filter';

import { description, name, version } from '../package.json';
import { ErrorType } from './infra/logger';
import { AppModule } from './module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true
  });

  const loggerService = app.get(ILoggerAdapter);

  loggerService.setApplication(name);
  app.useLogger(loggerService);

  app.useGlobalFilters(new ExceptionHandlerFilter(loggerService));

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET }
    ]
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'blob:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
        }
      }
    })
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(compression());

  const {
    ENV,
    MONGO: { MONGO_URL },
    PORT,
    HOST,
    IS_PRODUCTION
  } = app.get(ISecretsAdapter);

  app.use(bodyParser.urlencoded({ extended: true }));

  app.enableVersioning({ type: VersioningType.URI });

  process.on('uncaughtException', (error) => {
    loggerService.error(error as ErrorType);
  });

  process.on('unhandledRejection', (error) => {
    loggerService.error(error as ErrorType);
  });

  if (!IS_PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .addBearerAuth()
      .setVersion(version)
      .addServer(HOST)
      .addTag('Swagger Documentation')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(PORT, () => {
    loggerService.log(`🟢 ${name} listening at ${bold(PORT)} on ${bold(ENV?.toUpperCase())} 🟢`);
    if (!IS_PRODUCTION) {
      loggerService.log(`🟢 Swagger listening at ${bold(`${HOST}/docs`)} 🟢`);
      loggerService.log(`🟢 Graphql playground listening at ${bold(`${HOST}/graphql`)} 🟢`);
    }
  });

  loggerService.log(`🔵 Mongo listening at ${bold(MONGO_URL)}`);
}
bootstrap();
