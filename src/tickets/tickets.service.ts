import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets, WarranteeStatus } from './tickets.entity';
import { Repository } from 'typeorm';
import { Assets } from 'src/assets/assets.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets)
    private readonly ticketsRepository: Repository<Tickets>,
    @InjectRepository(Assets)
    private readonly assetsRepository: Repository<Assets>,
  ) {}

  async createTicket(data) {
    const { issueDescription, assetId, status } = data;
    const asset = await this.assetsRepository.findOne({
      where: { id: assetId },
      select: ['id', 'warranteeExpiryDate'],
    });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    const warranteeStatusAtCreation =
      new Date() <= asset.warranteeExpiryDate
        ? WarranteeStatus.in_warrantee
        : WarranteeStatus.out_of_warrantee;

    const ticket = this.ticketsRepository.create({
      issueDescription,
      asset: { id: assetId } as Assets,
      status,
      warranteeStatusAtCreation,
    });
    return await this.ticketsRepository.save(ticket);
  }
}
