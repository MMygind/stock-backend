import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Stock {
  @PrimaryColumn({ unique: true })
  public id: string;

  @Column({ unique: true })
  public stockName: string;

  @Column({})
  public initValue: number;

  @Column({})
  public currValue: number;

  @Column({})
  public description: string;
}
