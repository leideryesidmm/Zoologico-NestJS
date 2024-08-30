import { forwardRef, Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { SpeciesModule } from 'src/species/species.module';
import { Animal } from './entities/animal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonesModule } from 'src/zones/zones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal]),
    forwardRef(() => SpeciesModule),
    forwardRef(() => ZonesModule),
  ],
  controllers: [AnimalsController],
  providers: [AnimalsService],
  exports: [AnimalsService],
})
export class AnimalsModule {}
