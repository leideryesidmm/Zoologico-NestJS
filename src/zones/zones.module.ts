import { forwardRef, Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';
import { UsersModule } from 'src/users/users.module';
import { AnimalsModule } from 'src/animals/animals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Zone]),
    UsersModule,
    forwardRef(() => AnimalsModule),
  ],
  controllers: [ZonesController],
  providers: [ZonesService],
  exports: [ZonesService],
})
export class ZonesModule {}
