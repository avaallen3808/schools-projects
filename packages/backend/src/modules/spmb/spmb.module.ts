import { Module } from '@nestjs/common';
import { SpmbController } from './spmb.controller';
import { SpmbService } from './spmb.service';

@Module({
  controllers: [SpmbController],
  providers: [SpmbService],
  exports: [SpmbService],
})
export class SpmbModule {}
