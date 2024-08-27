import { Injectable } from '@nestjs/common';
import { CreateRevokedtokenDto } from './dto/create-revokedtoken.dto';
import { UpdateRevokedtokenDto } from './dto/update-revokedtoken.dto';

@Injectable()
export class RevokedtokensService {
  create(createRevokedtokenDto: CreateRevokedtokenDto) {
    return 'This action adds a new revokedtoken';
  }

  findAll() {
    return `This action returns all revokedtokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} revokedtoken`;
  }

  update(id: number, updateRevokedtokenDto: UpdateRevokedtokenDto) {
    return `This action updates a #${id} revokedtoken`;
  }

  remove(id: number) {
    return `This action removes a #${id} revokedtoken`;
  }
}
