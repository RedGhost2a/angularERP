import { TestBed } from '@angular/core/testing';

import { OuvrageOuvragesElementairesService } from './ouvrage-ouvrages-elementaires.service';

describe('OuvrageOuvragesElementairesService', () => {
  let service: OuvrageOuvragesElementairesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OuvrageOuvragesElementairesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
