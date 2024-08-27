import { Module } from '@nestjs/common';
import { RevokedtokensService } from './revokedtokens.service';
import { RevokedtokensController } from './revokedtokens.controller';

@Module({
  controllers: [RevokedtokensController],
  providers: [RevokedtokensService],
})
export class RevokedtokensModule {}
