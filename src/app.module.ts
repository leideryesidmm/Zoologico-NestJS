import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ZonesModule } from './zones/zones.module';
import { SpeciesModule } from './species/species.module';
import { AnimalsModule } from './animals/animals.module';
import { CommentsModule } from './comments/comments.module';
import { RevokedtokensModule } from './revokedtokens/revokedtokens.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Zone } from './zones/entities/zone.entity';
import { Species } from './species/entities/species.entity';
import { Animal } from './animals/entities/animal.entity';
import { Comment } from './comments/entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST_DB,
      port: parseInt(process.env.PORT_DB),
      username: process.env.USERNAME_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.DATABASE,
      entities: [User, Zone, Species, Animal, Comment],
      synchronize: true,
    }),
    UsersModule,
    ZonesModule,
    SpeciesModule,
    AnimalsModule,
    CommentsModule,
    RevokedtokensModule,
    AuthModule,
  ],
})
export class AppModule {}
