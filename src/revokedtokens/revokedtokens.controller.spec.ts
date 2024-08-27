import { Test, TestingModule } from '@nestjs/testing';
import { RevokedtokensController } from './revokedtokens.controller';
import { RevokedtokensService } from './revokedtokens.service';

describe('RevokedtokensController', () => {
  let controller: RevokedtokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevokedtokensController],
      providers: [RevokedtokensService],
    }).compile();

    controller = module.get<RevokedtokensController>(RevokedtokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
