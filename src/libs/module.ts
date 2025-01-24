import { Module } from '@nestjs/common';

import { EventLibModule } from './event';
import { TokenLibModule } from './token';

@Module({
  imports: [TokenLibModule, EventLibModule]
})
export class LibModule {}
