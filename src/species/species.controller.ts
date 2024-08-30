import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SpeciesService } from './species.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { Roles } from 'src/common/role.decorator';
import { Role } from 'src/users/entities/Role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createSpeciesDto: CreateSpeciesDto) {
    return this.speciesService.create(createSpeciesDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateSpeciesDto: UpdateSpeciesDto) {
    return this.speciesService.update(+id, updateSpeciesDto);
  }

  @Get('/byUser')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.JEFE, Role.EMPLOYEE)
  findAllByUser(@Req() req: Request) {
    const user = req['user'];
    return this.speciesService.findAllByUser(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.JEFE, Role.EMPLOYEE)
  findOne(@Param('id') id: string) {
    return this.speciesService.findOne(+id);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.speciesService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.speciesService.remove(+id);
  }
}
