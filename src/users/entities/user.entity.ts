import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './Role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  name: string;
  @Column({ nullable: false })
  userEmail: string;
  @Column({ nullable: false })
  pass: string;
  @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
  role: Role;
  @Column({ default: false })
  disable: boolean;
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'jefe_id' })
  jefeId: User | null;
}
