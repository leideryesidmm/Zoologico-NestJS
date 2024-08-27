import { PartialType } from '@nestjs/mapped-types';
import { CreateRevokedtokenDto } from './create-revokedtoken.dto';

export class UpdateRevokedtokenDto extends PartialType(CreateRevokedtokenDto) {}
