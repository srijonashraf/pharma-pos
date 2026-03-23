import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Medicine } from '../../medicines/entities/medicine.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'medicine_id', type: 'uuid' })
  medicineId: string;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: 'medicine_id' })
  medicine: Medicine;

  @Column({ name: 'medicine_name', type: 'varchar', length: 200 })
  medicineName: string;

  @Column({ type: 'varchar', length: 30 })
  unit: string;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({
    name: 'discount_pct',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discountPct: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  subtotal: number;
}
