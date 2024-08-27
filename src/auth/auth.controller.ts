import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateBossDto } from './dto/create-boss.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from 'src/common/role.decorator';
import { Role } from 'src/users/entities/Role.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register-boss')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  registerBoss(@Body() createAuthDto: CreateBossDto) {
    return this.authService.registerBoss(createAuthDto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('register-employee')
  registerEmployee(@Body() createAuthDto: CreateEmployeeDto) {
    return this.authService.registerEmployee(createAuthDto);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.login(createAuthDto);
  }
  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return this.authService.logout();
  }
}
