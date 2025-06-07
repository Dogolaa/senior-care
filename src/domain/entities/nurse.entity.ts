import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('nurse')
export class Nurse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  shift: string;

  @Column({ type: 'varchar' })
  coren: string;

  @Column({ type: 'varchar' })
  specialization: string;

  @OneToOne(() => User, (user) => user.nurse)
  @JoinColumn({ name: 'userId' })
  user: User;
}
