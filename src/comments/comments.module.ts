import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersModule } from 'src/users/users.module';
import { AnimalsModule } from 'src/animals/animals.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, AnimalsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
