import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assets } from './assets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assets])],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
