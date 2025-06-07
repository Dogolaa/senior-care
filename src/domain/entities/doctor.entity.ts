import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('doctor')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  shift: string;

  @Column({ type: 'varchar' })
  crm: string;

  @Column({ type: 'varchar' })
  specialization: string;

  @OneToOne(() => User, (user) => user.doctor)
  @JoinColumn({ name: 'userId' })
  user: User;
}
