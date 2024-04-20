/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { TrackTabService } from './track-tab.service';

describe('Service: TrackTab', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackTabService]
    });
  });

  it('should ...', inject([TrackTabService], (service: TrackTabService) => {
    expect(service).toBeTruthy();
  }));
});
