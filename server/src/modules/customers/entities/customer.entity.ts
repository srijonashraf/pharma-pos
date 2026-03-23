import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, default: 'individual' })
  type: string;

  @Column({ length: 200 })
  name: string;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  displayName: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'is_walking', default: false })
  isWalking: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
