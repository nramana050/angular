import { TestBed } from '@angular/core/testing';

import { QualificationSetupService } from './qualification-setup.service';

describe('QualificationSetupService', () => {
  let service: QualificationSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualificationSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
