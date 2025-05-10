// import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AssetStatus } from '../assets.entity';

export class GetAssetDto {
  id: number;
  name: string;
  status: string;
  //transformig date-time to date string
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString().slice(0, 10) : value,
  )
  purchaseDate: string;
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString().slice(0, 10) : value,
  )
  warranteeExpiryDate: string;
}

export class GroupedAssetDto {
  [key: string]: GetAssetDto;
}

export class CreateAssetDto {
  @ApiProperty({ example: 'Laptop' })
  name: string;
  @ApiProperty({ example: '2025-01-01' })
  purchaseDate: string;
  @ApiProperty({ example: '2026-01-01' })
  warranteeExpiryDate: string;
  @ApiProperty({
    enum: AssetStatus,
  })
  status: AssetStatus;
}

export class UpdateAssetDto {
  name?: string;
  purchaseDate?: string;
  warranteeExpiryDate?: string;
  status?: string;
}
