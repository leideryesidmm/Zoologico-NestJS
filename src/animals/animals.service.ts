import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { SpeciesService } from 'src/species/species.service';
import { Between, ILike, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal) private animalRepository: Repository<Animal>,
    @Inject(forwardRef(() => SpeciesService))
    private speciesService: SpeciesService,
  ) {}
  async create(createAnimalDto: CreateAnimalDto) {
    const nameExisting = await this.animalRepository.findOne({
      where: {
        name: ILike(createAnimalDto.name),
      },
    });
    if (nameExisting)
      throw new HttpException(
        `Animal with name ${createAnimalDto.name} already exist`,
        HttpStatus.CONFLICT,
      );
    await this.speciesService.findOne(createAnimalDto.speciesId);
    let animal = plainToClass(Animal, createAnimalDto);
    let animalSaved = await this.animalRepository.save(animal);
    return { id: animalSaved.id };
  }

  async findAll() {
    try {
      return await this.animalRepository.find();
    } catch (e) {
      throw new HttpException(
        `Ha ocurrido un error: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAllByUser(user: any) {
    return this.animalRepository.find({
      relations: ['speciesId'],
      where: { speciesId: { zoneId: { jefeId: { id: user.id } } } },
    });
  }
  async findOne(id: number) {
    if (!id) throw new HttpException('There is not ID', HttpStatus.BAD_REQUEST);
    return this.animalRepository
      .findOne({
        where: { id },
        relations: ['speciesId', 'speciesId.zoneId.jefeId'],
      })
      .then((animal) => {
        if (!animal) {
          throw new HttpException(
            `Animal with id: ${id} not found`,
            HttpStatus.NOT_FOUND,
          );
        }
        return animal;
      });
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    const existingAnimal = await this.findOne(id);
    const nameExisting = await this.animalRepository.findOne({
      where: {
        name: ILike(updateAnimalDto.name),
      },
    });
    if (nameExisting && nameExisting.id != id)
      throw new HttpException(
        `Animal with name ${updateAnimalDto.name} already exist`,
        HttpStatus.CONFLICT,
      );
    if (updateAnimalDto.speciesId)
      await this.speciesService.findOne(updateAnimalDto.speciesId);

    let animal = plainToClass(Animal, updateAnimalDto);
    animal.id = existingAnimal.id;

    animal = await this.animalRepository.save(animal);

    return { id: animal.id };
  }

  async countByZone(id: number) {
    const amount = await this.animalRepository.countBy({
      speciesId: { zoneId: { id: id } },
    });
    return { amount };
  }

  async countBySpecies(id: number) {
    const amount = await this.animalRepository.countBy({
      speciesId: { id: id },
    });
    return { amount };
  }

  async findByCreatedDate(date: Date) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const animals = await this.animalRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    return { animals };
  }

  async remove(id: number) {
    const existingAnimal = await this.findOne(id);
    this.animalRepository.delete(existingAnimal.id);
    return existingAnimal;
  }
}
