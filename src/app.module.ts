import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetsModule } from './assets/assets.module';
import { TicketsModule } from './tickets/tickets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assets } from './assets/assets.entity';
import { Tickets } from './tickets/tickets.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root123',
      database: 'asset_management',
      entities: [Assets, Tickets],
      synchronize: true,
    }),
    AssetsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
