import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'varchar', length: 20 })
  method: string;

  @Column({
    name: 'amount_taken',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  amountTaken: number;

  @Column({ name: 'amount_paid', type: 'numeric', precision: 12, scale: 2 })
  amountPaid: number;

  @Column({
    name: 'amount_return',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  amountReturn: number;

  @Column({
    name: 'amount_due',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  amountDue: number;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
