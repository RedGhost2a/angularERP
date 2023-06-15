import { TestBed } from '@angular/core/testing';

import { MetreService } from './metre.service';

describe('MetreServiceService', () => {
  let service: MetreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
