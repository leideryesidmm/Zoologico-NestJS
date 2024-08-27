import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RevokedtokensService } from './revokedtokens.service';
import { CreateRevokedtokenDto } from './dto/create-revokedtoken.dto';
import { UpdateRevokedtokenDto } from './dto/update-revokedtoken.dto';

@Controller('revokedtokens')
export class RevokedtokensController {
  constructor(private readonly revokedtokensService: RevokedtokensService) {}

  @Post()
  create(@Body() createRevokedtokenDto: CreateRevokedtokenDto) {
    return this.revokedtokensService.create(createRevokedtokenDto);
  }

  @Get()
  findAll() {
    return this.revokedtokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.revokedtokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRevokedtokenDto: UpdateRevokedtokenDto) {
    return this.revokedtokensService.update(+id, updateRevokedtokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.revokedtokensService.remove(+id);
  }
}
