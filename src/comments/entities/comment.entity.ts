import { Animal } from 'src/animals/entities/animal.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'initialComment_id' })
  initialComment: Comment;

  @ManyToOne(() => Animal, { nullable: false })
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: false })
  menssage: string;
}
