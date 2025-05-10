import { Body, Controller, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('/create')
  createTicket(@Body() data) {
    try {
      return this.ticketsService.createTicket(data);
    } catch (error) {
      console.log(error);
    }
  }
}
