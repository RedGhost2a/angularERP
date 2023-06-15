import { TestBed } from '@angular/core/testing';

import { OuvrageElementaireService } from './ouvrage-elementaire.service';

describe('OuvrageElementaireService', () => {
  let service: OuvrageElementaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuvrageElementaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
