import { Module } from '@nestjs/common';

import { TokenLibModule } from './token';

@Module({
  imports: [TokenLibModule],
})
export class LibModule {}
