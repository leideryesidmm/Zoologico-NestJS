import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { SpeciesService } from 'src/species/species.service';
import { ILike, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal) private animalRepository: Repository<Animal>,
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
    const species = await this.speciesService.findOne(
      createAnimalDto.speciesId,
    );
    let animal = plainToClass(Animal, createAnimalDto);
    let animalSaved = await this.animalRepository.save(animal);
    return { id: animalSaved.id };
  }

  findAll() {
    try {
      return this.animalRepository.find();
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
    return this.animalRepository.findOneBy({ id }).then((animal) => {
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

  remove(id: number) {
    return `This action removes a #${id} animal`;
  }
}
