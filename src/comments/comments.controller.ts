import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Role } from 'src/users/entities/Role.enum';
import { Roles } from 'src/common/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.JEFE, Role.EMPLOYEE)
  create(@Req() req: Request, @Body() createCommentDto: CreateCommentDto) {
    const user = req['user'];
    return this.commentsService.create(user, createCommentDto);
  }

  @Get('/comments-answers/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.JEFE, Role.EMPLOYEE)
  findAllByAnimal(@Param('id') id: string) {
    return this.commentsService.findAllByAnimal(+id);
  }

  @Get('/percentage-answers-comments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getPercentage() {
    return this.commentsService.getPercentage();
  }
}
