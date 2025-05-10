import { Tickets } from 'src/tickets/tickets.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AssetStatus {
  purchased = 'purchased',
  in_warrantee = 'in_warrantee',
  out_of_warrantee = 'out_of_warrantee',
  retired = 'retired',
}

@Entity()
export class Assets {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column()
  name: string;

  @Column()
  purchaseDate: Date;

  @Column()
  warranteeExpiryDate: Date;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.purchased })
  status: AssetStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tickets, (ticket) => ticket.asset)
  tickets: Tickets[];
}
