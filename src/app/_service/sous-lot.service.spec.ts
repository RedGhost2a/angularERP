import { TestBed } from '@angular/core/testing';

import { SousLotService } from './sous-lot.service';

describe('SousLotService', () => {
  let service: SousLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
