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
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Role } from 'src/users/entities/Role.enum';
import { Roles } from 'src/common/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zonesService.create(createZoneDto);
  }
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zonesService.update(+id, updateZoneDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.zonesService.findAll();
  }
  @Get('/byUser')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.JEFE, Role.EMPLOYEE)
  findAllByUser(@Req() req: Request) {
    const user = req['user'];
    return this.zonesService.findAllByUser(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.JEFE)
  findOne(@Param('id') id: string) {
    return this.zonesService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.zonesService.remove(+id);
  }
}
