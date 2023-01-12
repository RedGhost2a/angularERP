import { TestBed } from '@angular/core/testing';

import { SousLotOuvrageService } from './sous-lot-ouvrage.service';

describe('SousLotOuvrageServiceService', () => {
  let service: SousLotOuvrageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousLotOuvrageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
