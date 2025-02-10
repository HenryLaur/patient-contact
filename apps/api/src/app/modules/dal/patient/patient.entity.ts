import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../gender/gender.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  ssn: string;

  @Column()
  phoneNumber: string;

  @ManyToOne(() => Gender, { nullable: false })
  @JoinColumn()
  gender: Gender;

  // This is the foreign key column.
  // Allows us to query patients by genderId, without having to join the relation
  @Column({
    type: 'char',
    length: 36,
    nullable: true,
  })
  genderId: string;

  @Column({ default: false })
  contacted: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP(6)`,
    precision: 6,
  })
  created: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP(6)`,
    precision: 6,
  })
  updated: Date;
}
