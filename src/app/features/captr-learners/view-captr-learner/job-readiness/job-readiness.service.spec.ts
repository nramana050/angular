import { TestBed } from '@angular/core/testing';

import { JobReadinessService } from './job-readiness.service';

describe('JobReadinessService', () => {
  let service: JobReadinessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobReadinessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
