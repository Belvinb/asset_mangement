import { Injectable } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AssetStatusCronService {
  constructor(private readonly assetsService: AssetsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAssetStatusUpdate() {
    console.log('Running asset status update job...');
    await this.assetsService.updateAssetStatuses();
    console.log('Asset status update job completed.');
  }
}
