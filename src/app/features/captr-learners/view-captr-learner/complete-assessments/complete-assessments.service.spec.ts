import { TestBed, inject } from '@angular/core/testing';

import { CompleteAssessmentsService } from './complete-assessments.service';

describe('CompleteAssessmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompleteAssessmentsService]
    });
  });

  it('should be created', inject([CompleteAssessmentsService], (service: CompleteAssessmentsService) => {
    expect(service).toBeTruthy();
  }));
});
