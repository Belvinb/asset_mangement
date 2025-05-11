import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AssetResponseDto,
  AssetWithTicketsDto,
  CreateAssetDto,
  GetAssetDto,
  GroupedAssetDto,
  UpdateAssetDto,
} from './dto/assets.dto';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @ApiResponse({ type: [GetAssetDto] })
  @ApiOperation({ summary: 'Get all assets' })
  @Get()
  findAllAssets() {
    try {
      return this.assetsService.findAllAssets();
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({ type: GroupedAssetDto })
  @ApiOperation({ summary: 'Get all assets grouped by status' })
  @Get('/status')
  async findAssetsByStatus() {
    try {
      return this.assetsService.findAssetsByStatus();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @ApiResponse({ type: GetAssetDto })
  @ApiOperation({ summary: 'Get a single asset by id' })
  @Get(':assetId')
  findAssetById(@Param('assetId', ParseIntPipe) assetId: number) {
    try {
      return this.assetsService.findAssetById(assetId);
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({ type: AssetWithTicketsDto })
  @ApiOperation({ summary: 'Get a single asset by id and its open tickets' })
  @Get(':assetId/active_tickets')
  findAssetByIdWithOpenTickets(
    @Param('assetId', ParseIntPipe) assetId: number,
  ) {
    try {
      return this.assetsService.findAssetByIdWithOpenTickets(assetId);
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({ type: AssetResponseDto })
  @ApiOperation({ summary: 'Create a new asset' })
  @Post('/create')
  createAsset(@Body() data: CreateAssetDto) {
    try {
      return this.assetsService.createAsset(data);
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({ type: AssetResponseDto })
  @ApiOperation({ summary: 'Update an existing asset' })
  @Patch('/update/:assetId')
  updateAsset(
    @Param('assetId', ParseIntPipe) assetId: number,
    @Body() data: UpdateAssetDto,
  ) {
    try {
      return this.assetsService.updateAsset(assetId, data);
    } catch (error) {
      console.log(error);
    }
  }

  @ApiResponse({ type: AssetResponseDto })
  @ApiOperation({ summary: 'Delete an existing asset' })
  @Delete('/delete/:assetId')
  deleteAsset(@Param('assetId', ParseIntPipe) assetId: number) {
    try {
      return this.assetsService.deleteAsset(assetId);
    } catch (error) {
      console.log(error);
    }
  }
}
