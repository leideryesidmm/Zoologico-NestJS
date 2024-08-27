import { Species } from 'src/species/entities/species.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  @ManyToOne(() => Species, { nullable: false })
  @JoinColumn({ name: 'species_id' })
  species: Species;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
