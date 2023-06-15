import { TestBed } from '@angular/core/testing';

import { OuvrageElementaireCoutService } from './ouvrage-elementaire-cout.service';

describe('OuvrageElementaireCoutService', () => {
  let service: OuvrageElementaireCoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuvrageElementaireCoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
