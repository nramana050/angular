import { TestBed } from '@angular/core/testing';

import { GenaieService } from './genaie.service';

describe('GenaieService', () => {
  let service: GenaieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenaieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
