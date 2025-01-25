import { Module } from '@nestjs/common';
import { InfraModule } from './infra/module';
import { LibModule } from './libs/module';
import { HealthModule } from './modules/health/module';
import { WishlistModule } from './modules/wishlist/module';

@Module({
  imports: [InfraModule, HealthModule, LibModule, WishlistModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
