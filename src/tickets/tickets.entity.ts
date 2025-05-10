import { Assets } from 'src/assets/assets.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TicketStatus {
  open = 'open',
  in_progress = 'in_progress',
  closed = 'closed',
}

export enum WarranteeStatus {
  in_warrantee = 'in_warrantee',
  out_of_warrantee = 'out_of_warrantee',
}

@Entity()
export class Tickets {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column()
  issueDescription: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.open })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: WarranteeStatus,
    default: WarranteeStatus.in_warrantee,
  })
  warranteeStatusAtCreation: WarranteeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Assets, (asset) => asset.tickets, { onDelete: 'CASCADE' })
  asset: Assets;
}
