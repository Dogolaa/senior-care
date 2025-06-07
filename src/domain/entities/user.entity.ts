import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { Address } from './address.entity';
import { Nurse } from './nurse.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  cpf: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  password: string;

  @Column('uuid')
  addressId: string;

  @Column('uuid')
  roleId: string;

  @ManyToOne(() => Address, (address) => address.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToOne(() => Nurse, (nurse) => nurse.user)
  nurse?: Nurse;
}
