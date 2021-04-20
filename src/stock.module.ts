import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './infrastructure/stock.entity';
import { IStockServiceProvider } from './core/primary-ports/stock.service.interface';
import { StockService } from './core/services/stock.service';
import { StockGateway } from './gateways/stock.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  providers: [
    StockGateway,
    {
      provide: IStockServiceProvider,
      useClass: StockService,
    },
  ],
})
export class StockModule {}
