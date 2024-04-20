import { TestBed } from '@angular/core/testing';

import { DigitalCoursesService } from './digital-courses.service';

describe('DigitalCoursesService', () => {
  let service: DigitalCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
