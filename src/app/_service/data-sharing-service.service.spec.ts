import {TestBed} from '@angular/core/testing';

import {DataSharingService} from './data-sharing-service.service';

describe('DataSharingServiceService', () => {
  let service: DataSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
