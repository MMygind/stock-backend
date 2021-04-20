import { StockMoney } from '../models/stock-money.model';

export const IStockServiceProvider = 'IStockServiceProvider';
export interface IStockService {
  newStock(
    id: string,
    stockMoney: StockMoney
  ): Promise<StockMoney>;

  getStocks(): Promise<StockMoney[]>;

  delete(id: string): Promise<void>;

  updateStock(id: string, stockMoney: StockMoney): Promise<StockMoney>
}
