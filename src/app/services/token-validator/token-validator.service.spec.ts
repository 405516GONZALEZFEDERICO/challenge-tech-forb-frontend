import { TestBed } from '@angular/core/testing';

import { TokenValidatorService } from './token-validator.service';

describe('TokenValidatorService', () => {
  let service: TokenValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
