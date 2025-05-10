import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assets } from './assets.entity';
import { CreateAssetDto, GetAssetDto, GroupedAssetDto } from './dto/assets.dto';
import { plainToInstance } from 'class-transformer';

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
    // return await this.assetsRepository
    //   .createQueryBuilder('asset')
    //   .leftJoinAndSelect(
    //     'asset.tickets',
    //     'ticket',
    //     'ticket.status = :status AND ticket.warranteeStatusAtCreation = :warranty',
    //     {
    //       status: 'open',
    //       warranty: 'in_warrantee',
    //     },
    //   )
    //   .select([
    //     'asset.id',
    //     'asset.name',
    //     'asset.purchaseDate',
    //     'asset.warranteeExpiryDate',
    //     'ticket.id',
    //     'ticket.issueDescription',
    //     'ticket.status',
    //   ])
    //   .getMany();
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

  async findAssetsByStatus() {
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

  async createAsset(data: CreateAssetDto) {
    const { name, purchaseDate, warranteeExpiryDate, status } = data;
    const asset = this.assetsRepository.create({
      name,
      purchaseDate: new Date(purchaseDate),
      warranteeExpiryDate: new Date(warranteeExpiryDate),
      status,
    });
    const createdAsset = await this.assetsRepository.save(asset);

    return {
      id: createdAsset.id,
      status: HttpStatus.CREATED,
      message: 'Asset created successfully',
    };
  }

  async updateAsset(id: number, data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...fieldstoUpdate } = data;
    const asset = await this.assetsRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }
    await this.assetsRepository.save({ ...asset, ...fieldstoUpdate });

    return { id, status: HttpStatus.OK, message: 'Asset updated successfully' };
  }

  async deleteAsset(id: number) {
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
}
