import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import { Role } from './entities/Role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = plainToClass(User, createUserDto);
    const existingUser = await this.userRepository.findOne({
      where: { userEmail: ILike(createUserDto.userEmail) },
    });

    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }
    return this.userRepository.save(user).then((user) => {
      const { id, ...result } = user;
      return { id };
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    if (!id) throw new HttpException('There is not ID', HttpStatus.BAD_REQUEST);
    return this.userRepository.findOneBy({ id }).then((user) => {
      if (!user) {
        throw new HttpException(
          `User with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      const { pass, ...result } = user;
      return result;
    });
  }
  async findByEmail(email: string) {
    console.log(email);
    const user = await this.userRepository.findOne({
      where: { userEmail: email },
    });
    console.log(user);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!id) throw new HttpException('There is not ID', HttpStatus.BAD_REQUEST);
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updateUserDto.userEmail) {
      const emailInUse = await this.userRepository.findOne({
        where: { userEmail: ILike(updateUserDto.userEmail) },
      });

      if (emailInUse && emailInUse.id !== id) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }
    }
    if (updateUserDto.jefeId) {
      if (
        (updateUserDto.role && updateUserDto.role !== Role.EMPLOYEE) ||
        (!updateUserDto.role && existingUser.role !== Role.EMPLOYEE)
      ) {
        throw new HttpException(
          'You can only add a boss to users with the employee role',
          HttpStatus.NOT_FOUND,
        );
      }
      const jefe = await this.userRepository.findOne({ where: { id } });
      if (!jefe) {
        throw new HttpException('JefeId not found', HttpStatus.NOT_FOUND);
      }
    }
    const user = plainToClass(User, updateUserDto);
    await this.userRepository.update(id, user);

    return { id, statuscode: HttpStatus.OK };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
