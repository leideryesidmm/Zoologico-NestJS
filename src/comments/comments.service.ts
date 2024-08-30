import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnimalsService } from 'src/animals/animals.service';
import { UsersService } from 'src/users/users.service';
import { Comment } from './entities/comment.entity';
import { Role } from 'src/users/entities/Role.enum';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { Animal } from 'src/animals/entities/animal.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private animalService: AnimalsService,
    private userService: UsersService,
  ) {}
  async create(userIn: any, createCommentDto: CreateCommentDto) {
    const animal = await this.animalService.findOne(createCommentDto.animal);
    const user = await this.userService.findOne(userIn.id);
    if (
      user.role === Role.JEFE &&
      animal.speciesId.zoneId.jefeId.id !== user.id
    )
      throw new HttpException(
        'You cannot comment on unassigned animals',
        HttpStatus.CONFLICT,
      );
    if (
      user.role === Role.EMPLOYEE &&
      animal.speciesId.zoneId.jefeId.id !== user.jefeId.id
    )
      throw new HttpException(
        'You cannot comment on unassigned animals',
        HttpStatus.CONFLICT,
      );

    if (createCommentDto.initialComment) {
      const initialComment = await this.commentRepository.findOne({
        where: {
          id: createCommentDto.initialComment,
        },
        relations: ['animal'],
      });
      if (!initialComment)
        throw new HttpException(
          'Initial Comment not found',
          HttpStatus.NOT_FOUND,
        );
      if (initialComment.animal.id !== animal.id)
        throw new HttpException(
          'Initial Comment not is a comment of your animals',
          HttpStatus.NOT_FOUND,
        );
    }
    const comment = plainToClass(Comment, createCommentDto);
    comment.user = plainToClass(User, user);
    comment.animal = plainToClass(Animal, animal);
    return this.commentRepository.save(comment);
  }

  async getPercentage() {
    const amountComments = await this.commentRepository.count({
      where: {
        initialComment: IsNull(),
      },
    });

    const commentIds = await this.commentRepository
      .createQueryBuilder('comment')
      .select('comment.initialComment.id', 'initialCommentId')
      .where('comment.initialComment IS NOT NULL')
      .distinct(true)
      .getRawMany();
    const initialCommentIds = commentIds.map((row) => row.initialCommentId);

    const percentage =
      initialCommentIds.length > 0
        ? (initialCommentIds.length / amountComments) * 100
        : 0;

    return { percentage };
  }

  async findAllByAnimal(id: number) {
    const comments = await this.findAllCommentsByAnimal(id);
    const commentsWithAnswers = await Promise.all(
      comments.map(async (comment) => {
        const answers = await this.findAllAnswersByComment(comment.id);
        return {
          comment,
          answers,
        };
      }),
    );
    return commentsWithAnswers;
  }
  async findAllCommentsByAnimal(id: number) {
    const animal = await this.animalService.findOne(id);
    const comments = this.commentRepository.find({
      where: {
        animal: { id: animal.id },
        initialComment: IsNull(),
      },
    });
    return comments;
  }
  async findAllAnswersByComment(id: number) {
    const initialComment = await this.commentRepository.findOne({
      relations: ['initialComment'],
      where: { id: id },
    });
    if (!initialComment)
      throw new HttpException('Initial commit not found', HttpStatus.NOT_FOUND);
    if (initialComment.initialComment)
      throw new HttpException(
        `ID ${id} not is a initial comment`,
        HttpStatus.BAD_REQUEST,
      );
    const answers = this.commentRepository.find({
      where: {
        initialComment: { id: id },
      },
    });
    return answers;
  }
}
