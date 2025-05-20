import { Module } from '@nestjs/common';
import { AblyController } from './ably.controller';
import { AblyService } from './ably.service';

@Module({
  controllers: [AblyController],
  providers: [AblyService],
  exports: [AblyService],
})
export class AblyModule {}
