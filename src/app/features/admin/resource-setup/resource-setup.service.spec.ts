import { TestBed } from '@angular/core/testing';

import { ResourceSetupService } from './resource-setup.service';

describe('ResourceSetupService', () => {
  let service: ResourceSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
