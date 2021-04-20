import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';

import {
  IStockService,
  IStockServiceProvider,
} from '../core/primary-ports/stock.service.interface';
import { Socket } from 'socket.io';
import {StockDto} from "../dtos/stock.dto";
import {StockMoney} from "../core/models/stock-money.model";
import {Stock} from "../infrastructure/stock.entity";

@WebSocketGateway()
export class StockGateway {
  constructor(
    @Inject(IStockServiceProvider) private stockService: IStockService,
  ) {}

  @WebSocketServer() server;
  @SubscribeMessage('stock')
  async handleStockEvent(
    @MessageBody() stockMoney: StockMoney,
    @ConnectedSocket() stock: Socket,
  ): Promise<void> {
    try {
      const stockClient = await this.stockService.newStock(
        stock.id,
        stockMoney
      );
      const stockClients = await this.stockService.getStocks();

      const stockDto: StockDto = {
        stocks: stockClients,
        stock: stockClient,
      };
      stock.emit('stockDto', stockDto);
      this.server.emit('stocks', stockClients);

    } catch (e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage('updateStock')
  async handleUpdateStockEvent(
      @MessageBody() stockValue: StockMoney,
      @ConnectedSocket() stock: Socket,
  ): Promise<void> {
    try {
      console.log('', stockValue);
      const stockUpdate = await this.stockService.updateStock(stockValue.id, stockValue);
      const stocks = await this.stockService.getStocks();
      const stockDto: StockDto = {
        stocks: stocks,
        stock: stockUpdate
      };
      stock.emit('stockDto', stockDto);
      this.server.emit('stocks', stocks)
    } catch(e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage('welcomeStock')
  async handleWelcomeStockEvent(@ConnectedSocket() socket: Socket,
  ): Promise<void>
  {
    const stockClients = await this.stockService.getStocks();

    socket.emit('stocks', stockClients);
  }
}
