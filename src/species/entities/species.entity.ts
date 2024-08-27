import { Zone } from 'src/zones/entities/zone.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Species {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  name: string;
  @ManyToOne(() => Zone, { nullable: false })
  @JoinColumn({ name: 'zone_id' })
  zoneId: Zone;
}
