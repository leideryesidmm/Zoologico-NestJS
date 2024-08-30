import { forwardRef, Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { ZonesModule } from 'src/zones/zones.module';
import { AnimalsModule } from 'src/animals/animals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Species]),
    forwardRef(() => AnimalsModule),
    forwardRef(() => ZonesModule),
  ],
  controllers: [SpeciesController],
  providers: [SpeciesService],
  exports: [SpeciesService],
})
export class SpeciesModule {}
