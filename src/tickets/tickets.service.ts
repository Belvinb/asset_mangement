import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets, WarranteeStatus } from './tickets.entity';
import { Repository } from 'typeorm';
import { Assets } from 'src/assets/assets.entity';
import { isBefore } from 'date-fns';
import {
  CreateTicketDto,
  TicketResponseDto,
  updateTicketDto,
} from './dto/tickets.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets)
    private readonly ticketsRepository: Repository<Tickets>,
    @InjectRepository(Assets)
    private readonly assetsRepository: Repository<Assets>,
  ) {}

  async createTicket(data: CreateTicketDto): Promise<TicketResponseDto> {
    const { issueDescription, assetId, status } = data;
    const asset = await this.assetsRepository.findOne({
      where: { id: assetId },
      select: ['id', 'warranteeExpiryDate'],
    });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    const now = new Date();
    const warranteeStatusAtCreation = isBefore(now, asset.warranteeExpiryDate)
      ? WarranteeStatus.in_warrantee
      : WarranteeStatus.out_of_warrantee;

    const ticket = this.ticketsRepository.create({
      issueDescription,
      asset: { id: assetId } as Assets,
      status,
      warranteeStatusAtCreation,
    });
    const res = await this.ticketsRepository.save(ticket);
    return {
      id: res.id,
      status: HttpStatus.CREATED,
      message: 'Ticket created successfully',
    };
  }

  async updateTicket(
    id: number,
    data: updateTicketDto,
  ): Promise<TicketResponseDto> {
    const { status } = data;
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    ticket.status = status;
    await this.ticketsRepository.save(ticket);
    return {
      id,
      status: HttpStatus.OK,
      message: 'Ticket updated successfully',
    };
  }

  async deleteTicket(id: number): Promise<TicketResponseDto> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    await this.ticketsRepository.remove(ticket);
    return {
      id,
      status: HttpStatus.NO_CONTENT,
      message: 'Ticket deleted successfully',
    };
  }
}
