import { TestBed } from '@angular/core/testing';

import { TypeCoutService } from './typeCout.service';

describe('TypeCoutService', () => {
  let service: TypeCoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeCoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
