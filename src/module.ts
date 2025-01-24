import { Module } from '@nestjs/common';
import { InfraModule } from './infra/module';
import { LibModule } from './libs/module';
import { HealthModule } from './modules/health/module';

@Module({
  imports: [InfraModule, HealthModule, LibModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
