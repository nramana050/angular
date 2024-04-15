import { TestBed } from '@angular/core/testing';

import { ConatctServicesService } from './conatct-services.service';

describe('ConatctServicesService', () => {
  let service: ConatctServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConatctServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
