import { TestBed } from '@angular/core/testing';

import { ProviderSetupService } from './provider-setup.service';

describe('ProviderSetupService', () => {
  let service: ProviderSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
