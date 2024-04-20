import { TestBed } from '@angular/core/testing';

import { CaseloadOverviewService } from './caseload-overview.service';

describe('CaseloadOverviewService', () => {
  let service: CaseloadOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseloadOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
