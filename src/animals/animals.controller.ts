import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Role } from 'src/users/entities/Role.enum';
import { Roles } from 'src/common/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.animalsService.findAll();
  }
  @Get('byUser')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.JEFE, Role.EMPLOYEE)
  findAllbyUsery(@Req() req: Request) {
    const user = req['user'];
    return this.animalsService.findAllByUser(user);
  }

  @Get('countByZone/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  countByZone(@Param('id') id: string) {
    return this.animalsService.countByZone(+id);
  }
  @Get('countBySpecies/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  countBySpecies(@Param('id') id: string) {
    return this.animalsService.countBySpecies(+id);
  }

  @Get('findByCreatedDate/:date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findByCreatedDate(@Param('date') date: Date) {
    const convertedDate = new Date(date);
    return this.animalsService.findByCreatedDate(convertedDate);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.JEFE, Role.EMPLOYEE)
  findOne(@Param('id') id: string) {
    return this.animalsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalsService.update(+id, updateAnimalDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.animalsService.remove(+id);
  }
}
