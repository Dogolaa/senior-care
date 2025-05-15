import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'USER', 'GUEST'],
  })
  name: 'ADMIN' | 'USER' | 'GUEST';

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
