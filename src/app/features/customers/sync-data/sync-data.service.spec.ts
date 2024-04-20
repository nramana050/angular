import { TestBed } from '@angular/core/testing';

import { SyncDataService } from './sync-data.service';

describe('SyncDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyncDataService = TestBed.get(SyncDataService);
    expect(service).toBeTruthy();
  });
});
