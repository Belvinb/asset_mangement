import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTicketDto,
  TicketResponseDto,
  updateTicketDto,
} from './dto/tickets.dto';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiResponse({ type: TicketResponseDto })
  @ApiOperation({ summary: 'Create new ticket' })
  @Post('/create')
  createTicket(@Body() data: CreateTicketDto) {
    try {
      return this.ticketsService.createTicket(data);
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({ type: TicketResponseDto })
  @ApiOperation({ summary: 'Update ticket status' })
  @Patch('/update_status/:ticketId')
  updateTicket(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() data: updateTicketDto,
  ) {
    try {
      return this.ticketsService.updateTicket(ticketId, data);
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({ type: TicketResponseDto })
  @ApiOperation({ summary: 'Delete ticket' })
  @Delete('/delete/:ticketId')
  deleteTicket(@Param('ticketId', ParseIntPipe) ticketId: number) {
    try {
      return this.ticketsService.deleteTicket(ticketId);
    } catch (error) {
      console.log(error);
    }
  }
}
