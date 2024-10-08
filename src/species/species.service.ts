import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { ZonesService } from 'src/zones/zones.service';
import { Species } from './entities/species.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { AnimalsService } from 'src/animals/animals.service';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species) private speciesRepository: Repository<Species>,
    @Inject(forwardRef(() => AnimalsService))
    private animalService: AnimalsService,

    @Inject(forwardRef(() => ZonesService))
    private zoneService: ZonesService,
  ) {}
  async create(createSpeciesDto: CreateSpeciesDto) {
    const nameExisting = await this.speciesRepository.findOne({
      where: {
        name: ILike(createSpeciesDto.name),
      },
    });
    if (nameExisting)
      throw new HttpException(
        `Species with name ${createSpeciesDto.name} already exist`,
        HttpStatus.CONFLICT,
      );
    await this.zoneService.findOne(createSpeciesDto.zoneId);
    let species = plainToClass(Species, createSpeciesDto);
    let speciesSaved = await this.speciesRepository.save(species);
    return { id: speciesSaved.id };
  }

  async update(id: number, updateSpeciesDto: UpdateSpeciesDto) {
    const existingSpecies = await this.speciesRepository.findOne({
      where: { id },
    });
    if (!existingSpecies) {
      throw new HttpException(
        `Species with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const nameExisting = await this.speciesRepository.findOne({
      where: {
        name: ILike(updateSpeciesDto.name),
      },
    });
    if (nameExisting && nameExisting.id != id)
      throw new HttpException(
        `Species with name ${updateSpeciesDto.name} already exist`,
        HttpStatus.CONFLICT,
      );

    if (updateSpeciesDto.zoneId)
      await this.zoneService.findOne(updateSpeciesDto.zoneId);

    let species = plainToClass(Species, updateSpeciesDto);
    species.id = id;

    species = await this.speciesRepository.save(species);

    return { id: species.id };
  }

  async findOne(id: number) {
    if (!id) throw new HttpException('There is not ID', HttpStatus.BAD_REQUEST);
    return this.speciesRepository.findOneBy({ id }).then((species) => {
      if (!species) {
        throw new HttpException(
          `Species with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return species;
    });
  }

  async findAll() {
    try {
      return await this.speciesRepository.find();
    } catch (e) {
      throw new HttpException(
        `Ha ocurrido un error: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAllByUser(user: any) {
    return this.speciesRepository.find({
      relations: ['zoneId'],
      where: { zoneId: { jefeId: { id: user.id } } },
    });
  }

  async remove(id: number) {
    const species = await this.findOne(id);
    const amount = await this.animalService.countBySpecies(species.id);
    if (amount.amount > 0) {
      throw new HttpException(
        'A species with associated animals cannot be eliminated.',
        HttpStatus.CONFLICT,
      );
    }
    this.speciesRepository.delete(species.id);
    return species;
  }
}
