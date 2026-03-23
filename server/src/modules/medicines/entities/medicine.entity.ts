import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({
    name: 'generic_name',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  genericName: string | null;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  barcode: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  brand: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @Column({ type: 'varchar', length: 30, default: 'Pcs' })
  unit: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({
    name: 'discount_pct',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discountPct: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
