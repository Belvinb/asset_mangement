// import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AssetStatus } from '../assets.entity';
import { IsDefined, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { format } from 'date-fns';

export class GetAssetDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Laptop' })
  name: string;
  @ApiProperty({ example: 'purchased' })
  status: string;
  //transformig date-time to date string
  @ApiProperty({ example: '2025-01-01' })
  @Transform(({ value }) =>
    value instanceof Date ? format(value, 'yyyy-MM-dd') : value,
  )
  purchaseDate: string;
  @ApiProperty({ example: '2026-01-01' })
  @Transform(({ value }) =>
    value instanceof Date ? format(value, 'yyyy-MM-dd') : value,
  )
  warranteeExpiryDate: string;
}

export class AssetWithTicketsDto extends GetAssetDto {
  @ApiProperty({ example: [] })
  tickets: number[];
}

export class GroupedAssetDto {
  [key: string]: GetAssetDto;
}

export class CreateAssetDto {
  @ApiProperty({ example: 'Laptop' })
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsNotEmpty()
  @IsDefined()
  @Transform(({ value }) => new Date(value))
  purchaseDate: Date;

  @ApiProperty({ example: '2026-01-01' })
  @IsNotEmpty()
  @IsDefined()
  @Transform(({ value }) => new Date(value))
  warranteeExpiryDate: Date;

  @ApiProperty({
    enum: AssetStatus,
  })
  @IsEnum(AssetStatus)
  @IsDefined()
  status: AssetStatus;
}

export class UpdateAssetDto {
  @ApiProperty({ example: 'Laptop' })
  @IsOptional()
  name?: string;
  @ApiProperty({ example: '2025-01-01' })
  @IsOptional()
  purchaseDate?: string;
  @ApiProperty({ example: '2026-01-01' })
  @IsOptional()
  warranteeExpiryDate?: string;
  @ApiProperty({
    enum: AssetStatus,
  })
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;
}

export class AssetResponseDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 200 })
  status: number;
  @ApiProperty({ example: 'Asset modified successfully' })
  message: string;
}
