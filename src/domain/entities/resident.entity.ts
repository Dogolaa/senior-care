import { Gender } from 'src/application/dtos/resident/createResident.dto';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FamilyMember } from './familyMember.entity';

@Entity('residents')
export class Resident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  cpf: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'varchar' })
  gender: Gender;

  @Column({ type: 'date' })
  admissionDate: string;

  @OneToMany(() => FamilyMember, (familyMember) => familyMember.resident)
  familyMember?: FamilyMember[];
}
