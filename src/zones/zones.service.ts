import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';
import { ILike, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/users/entities/Role.enum';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone) private zoneRepository: Repository<Zone>,
    private userService: UsersService,
  ) {}
  async create(createZoneDto: CreateZoneDto) {
    const nameExisting = await this.zoneRepository.findOne({
      where: {
        name: ILike(createZoneDto.name),
      },
    });
    if (nameExisting)
      throw new HttpException(
        `Zone with name ${createZoneDto.name} already exist`,
        HttpStatus.CONFLICT,
      );
    const jefeExisting = await this.userService.findOne(createZoneDto.jefeId);
    if (!jefeExisting || jefeExisting.role !== Role.JEFE)
      throw new HttpException(
        `Boss with id ${createZoneDto.jefeId} not exist or is an employee`,
        HttpStatus.CONFLICT,
      );

    let zone = plainToClass(Zone, createZoneDto);
    zone = await this.zoneRepository.save(zone);
    return { id: zone.id };
  }

  findAll() {
    try {
      return this.zoneRepository.find();
    } catch (e) {
      throw new HttpException(
        `Ha ocurrido un error: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  findAllByUser(user: any) {
    return this.zoneRepository.find({
      relations: ['jefeId'],
      where: { jefeId: { id: user.id } },
      select: {
        id: true,
        name: true,
        jefeId: {
          id: true,
          name: true,
          userEmail: true,
        },
      },
    });
  }

  async findOne(id: number) {
    if (!id) throw new HttpException('There is not ID', HttpStatus.BAD_REQUEST);
    return this.zoneRepository.findOneBy({ id }).then((zone) => {
      if (!zone) {
        throw new HttpException(
          `Zone with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return zone;
    });
  }

  async update(id: number, updateZoneDto: UpdateZoneDto) {
    const existingZone = await this.zoneRepository.findOne({ where: { id } });
    if (!existingZone) {
      throw new HttpException(
        `Zone with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const nameExisting = await this.zoneRepository.findOne({
      where: {
        name: ILike(updateZoneDto.name),
      },
    });
    if (nameExisting && nameExisting.id != id)
      throw new HttpException(
        `Zone with name ${updateZoneDto.name} already exist`,
        HttpStatus.CONFLICT,
      );
    if (updateZoneDto.jefeId) {
      const jefeExisting = await this.userService.findOne(updateZoneDto.jefeId);
      if (!jefeExisting || jefeExisting.role !== Role.JEFE)
        throw new HttpException(
          `Boss with id ${updateZoneDto.jefeId} not exist or is an employee`,
          HttpStatus.CONFLICT,
        );
    }
    let zone = plainToClass(Zone, updateZoneDto);
    zone.id = id;

    zone = await this.zoneRepository.save(zone);

    return { id: zone.id };
  }

  remove(id: number) {
    const zone = this.findOne(id);

    return zone;
  }
}
