/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { TrackLiteSyncDataService } from './track-lite-sync-data.service';

describe('Service: TrackLiteSyncData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackLiteSyncDataService]
    });
  });

  it('should ...', inject([TrackLiteSyncDataService], (service: TrackLiteSyncDataService) => {
    expect(service).toBeTruthy();
  }));
});
