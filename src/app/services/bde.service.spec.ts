import { TestBed } from '@angular/core/testing';

import { BdeService } from './bde.service';

describe('BdeService', () => {
  let service: BdeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
