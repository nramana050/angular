import { TestBed } from '@angular/core/testing';

import { CourseSetupService } from './course-setup.service';

describe('CourseSetupService', () => {
  let service: CourseSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
