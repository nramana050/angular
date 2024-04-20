import { TestBed } from '@angular/core/testing';

import { padhaiService } from './padhai.service';

describe('padhaiService', () => {
  let service: padhaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(padhaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
