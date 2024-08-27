import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBossDto } from './dto/create-boss.dto';
import { UsersService } from 'src/users/users.service';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from 'src/users/entities/Role.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async registerBoss(createBossDto: CreateBossDto) {
    let user = plainToClass(CreateUserDto, createBossDto);
    user.role = Role.JEFE;
    const passencript = await hash(user.pass, 10);
    user = { ...user, pass: passencript };
    return this.userService.create(user);
  }
  async registerEmployee(createEmployeeDto: CreateEmployeeDto) {
    let user = plainToClass(CreateUserDto, createEmployeeDto);
    user.role = Role.EMPLOYEE;
    const passencript = await hash(user.pass, 10);
    user = { ...user, pass: passencript };
    return this.userService.create(user);
  }
  async login(loginAuthDto: LoginAuthDto) {
    const { userEmail, pass } = loginAuthDto;
    const userExisting = await this.userService.findByEmail(userEmail);
    const checkPass = await compare(pass, userExisting.pass);

    if (!checkPass)
      throw new HttpException('Password Incorrect', HttpStatus.FORBIDDEN);

    const payload = {
      id: userExisting.id,
      userEmail: userExisting.userEmail,
      role: userExisting.role,
    };

    const token = this.jwtService.sign(payload);

    return { token };
  }
  logout() {
    return 'This action adds a new auth';
  }
}
