import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Revokedtoken {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  token: string;
  @Column({ nullable: false })
  expiration: Date;
}
