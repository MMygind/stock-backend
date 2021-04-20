import { IStockService } from '../primary-ports/stock.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../../infrastructure/stock.entity';
import { StockMoney } from '../models/stock-money.model';
import {HttpException, HttpStatus} from "@nestjs/common";

export class StockService implements IStockService {
  allStocks: StockMoney[] = [];

  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async newStock(
    id: string,
    stockMoney: StockMoney
  ): Promise<StockMoney> {
    const stockDb = await this.stockRepository.findOne({
      stockName: stockMoney.stockName,
    });
    if (!stockDb) {
      let stock = this.stockRepository.create();
      stock.id = id;
      stock.stockName = stockMoney.stockName;
      stock.initValue = stockMoney.initValue;
      stock.currValue = stockMoney.currValue;
      stock.description = stockMoney.description;
      stock = await this.stockRepository.save(stock);
      return {
        id: '' + stock.id,
        stockName: stock.stockName,
        initValue: stock.initValue,
        currValue: stock.currValue,
        description: stock.description,
      };
    }

    if (stockDb.id === id) {
      return {
        id: stockDb.id,
        stockName: stockDb.stockName,
        initValue: stockDb.initValue,
        currValue: stockDb.currValue,
        description: stockDb.description,
      };
    } else {
      throw new Error('Stock already exists');
    }
  }

  async getStocks(): Promise<StockMoney[]> {
    const stocks = await this.stockRepository.find();
    const stockEntities: Stock[] = JSON.parse(JSON.stringify(stocks));
    return stockEntities;
  }

  async updateStock(id: string, stock: StockMoney): Promise<StockMoney> {
    await this.stockRepository.update(id, stock);
    const updatedStock = await this.stockRepository.findOne(id);
    if(updatedStock) {
      return updatedStock;
    }
    else {
      throw new Error('Stock not found');
    }
  }

  async delete(id: string): Promise<void> {
    await this.stockRepository.delete({ id: id });
    this.allStocks = this.allStocks.filter((s) => s.id !== id);
  }
}
