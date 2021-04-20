import {StockMoney} from "../core/models/stock-money.model";

export interface StockDto {
    stocks: StockMoney[];
    stock: StockMoney;
}
