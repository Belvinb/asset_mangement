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
import { ApiTags } from '@nestjs/swagger';
import { CreateAssetDto, UpdateAssetDto } from './dto/assets.dto';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAllAssets() {
    try {
      return this.assetsService.findAllAssets();
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/status')
  async findAssetsByStatus() {
    try {
      return this.assetsService.findAssetsByStatus();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get(':id')
  findAssetById(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.assetsService.findAssetById(id);
    } catch (error) {
      console.log(error);
    }
  }
  @Post('/create')
  createAsset(@Body() data: CreateAssetDto) {
    try {
      return this.assetsService.createAsset(data);
    } catch (error) {
      console.log(error);
    }
  }

  @Patch('/update/:id')
  updateAsset(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAssetDto,
  ) {
    try {
      return this.assetsService.updateAsset(id, data);
    } catch (error) {
      console.log(error);
    }
  }

  @Delete('/delete/:id')
  deleteAsset(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.assetsService.deleteAsset(id);
    } catch (error) {
      console.log(error);
    }
  }
}
