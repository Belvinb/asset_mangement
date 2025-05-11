import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Assets, AssetStatus } from './assets.entity';
import {
  AssetResponseDto,
  AssetWithTicketsDto,
  CreateAssetDto,
  GetAssetDto,
  GroupedAssetDto,
  UpdateAssetDto,
} from './dto/assets.dto';
import { plainToInstance } from 'class-transformer';
import { startOfDay } from 'date-fns';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Assets)
    private readonly assetsRepository: Repository<Assets>,
  ) {}

  async findAllAssets(): Promise<GetAssetDto[]> {
    const data = await this.assetsRepository.find({
      select: ['id', 'name', 'status', 'purchaseDate', 'warranteeExpiryDate'],
    });
    return plainToInstance(GetAssetDto, data);
  }

  async findAssetById(id: number): Promise<GetAssetDto> {
    const asset = await this.assetsRepository.findOne({
      where: { id },
      select: ['id', 'name', 'status', 'purchaseDate', 'warranteeExpiryDate'],
    });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    return plainToInstance(GetAssetDto, asset);
  }

  async findAssetByIdWithOpenTickets(id: number): Promise<AssetWithTicketsDto> {
    const result = await this.assetsRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.tickets', 'ticket', 'ticket.status = :status', {
        status: 'open',
      })
      .select([
        'asset.id',
        'asset.name',
        'asset.purchaseDate',
        'asset.warranteeExpiryDate',
        'asset.status',
        'ticket.id',
        'ticket.issueDescription',
        'ticket.status',
      ])
      .where('asset.id = :id', { id })
      .getOne();

    if (!result) {
      throw new NotFoundException('Asset not found');
    }
    return plainToInstance(AssetWithTicketsDto, result);
  }

  async findAssetsByStatus(): Promise<GroupedAssetDto> {
    const assets = await this.assetsRepository.find({
      select: ['id', 'name', 'purchaseDate', 'warranteeExpiryDate', 'status'],
    });

    const groupedAssets = assets.reduce((acc, asset) => {
      if (!acc[asset.status]) {
        acc[asset.status] = [];
      }
      acc[asset.status].push(asset);
      return acc;
    }, {});
    const transformedResult: GroupedAssetDto = {};
    for (const key of Object.keys(groupedAssets)) {
      transformedResult[key] = plainToInstance(GetAssetDto, groupedAssets[key]);
    }

    return transformedResult;
  }

  async createAsset(data: CreateAssetDto): Promise<AssetResponseDto> {
    const { name, purchaseDate, warranteeExpiryDate, status } = data;
    const asset = this.assetsRepository.create({
      name,
      purchaseDate,
      warranteeExpiryDate,
      status,
    });
    const createdAsset = await this.assetsRepository.save(asset);

    return {
      id: createdAsset.id,
      status: HttpStatus.CREATED,
      message: 'Asset created successfully',
    };
  }

  async updateAsset(
    id: number,
    data: UpdateAssetDto,
  ): Promise<AssetResponseDto> {
    const { ...fieldstoUpdate } = data;
    const asset = await this.assetsRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    await this.assetsRepository.save({ ...asset, ...fieldstoUpdate });

    return { id, status: HttpStatus.OK, message: 'Asset updated successfully' };
  }

  async deleteAsset(id: number): Promise<AssetResponseDto> {
    const asset = await this.assetsRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    await this.assetsRepository.remove(asset);
    return {
      id,
      status: HttpStatus.NO_CONTENT,
      message: 'Asset deleted successfully',
    };
  }

  //cron status update
  async updateAssetStatuses() {
    const now = startOfDay(new Date());

    //updates purchased status to in_warrantee
    await this.assetsRepository.update(
      {
        purchaseDate: LessThan(now),
        warranteeExpiryDate: MoreThanOrEqual(now),
        status: Not(AssetStatus.retired),
      },
      { status: AssetStatus.in_warrantee },
    );

    //updates in_warrantee status to out_of_warrantee
    await this.assetsRepository.update(
      {
        warranteeExpiryDate: LessThan(now),
        status: Not(AssetStatus.retired),
      },
      { status: AssetStatus.out_of_warrantee },
    );
  }
}
