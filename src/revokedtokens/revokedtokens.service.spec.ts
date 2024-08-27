import { Test, TestingModule } from '@nestjs/testing';
import { RevokedtokensService } from './revokedtokens.service';

describe('RevokedtokensService', () => {
  let service: RevokedtokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevokedtokensService],
    }).compile();

    service = module.get<RevokedtokensService>(RevokedtokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
