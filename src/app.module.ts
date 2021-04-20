import { Module } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import {StockModule} from "./stock.module";
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "./infrastructure/database.module";

@Module({
  imports: [
      StockModule,
      ConfigModule.forRoot({
        validationSchema: Joi.object({
          POSTGRES_HOST: Joi.string().required(),
          POSTGRES_PORT: Joi.number().required(),
          POSTGRES_USER: Joi.string().required(),
          POSTGRES_PASSWORD: Joi.string().required(),
          POSTGRES_DB: Joi.string().required(),
          PORT: Joi.number(),
        }),
      }),
      DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
