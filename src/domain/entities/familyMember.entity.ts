import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Resident } from './resident.entity';

@Entity('family_member')
export class FamilyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  relationship: string;

  @ManyToOne(() => Resident, (resident) => resident.familyMember)
  @JoinColumn({ name: 'residentId' })
  resident: Resident;

  @OneToOne(() => User, (user) => user.familyMember)
  @JoinColumn({ name: 'userId' })
  user: User;
}
