/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PlanInductionService } from './plan-induction.service';

describe('Service: PlanInduction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanInductionService]
    });
  });

  it('should ...', inject([PlanInductionService], (service: PlanInductionService) => {
    expect(service).toBeTruthy();
  }));
});
