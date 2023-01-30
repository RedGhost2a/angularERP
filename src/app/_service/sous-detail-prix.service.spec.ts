import { TestBed } from '@angular/core/testing';

import { SousDetailPrixService } from './sous-detail-prix.service';

describe('SousDetailPrixService', () => {
  let service: SousDetailPrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousDetailPrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
