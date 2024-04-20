import { TestBed } from '@angular/core/testing';

import { ProgrammeDeliveryService } from './programme-delivery.service';

describe('ProgrammeDeliveryService', () => {
  let service: ProgrammeDeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgrammeDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
