import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from './tickets.entity';
import { Assets } from 'src/assets/assets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assets, Tickets])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
