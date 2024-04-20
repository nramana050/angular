import { TestBed } from '@angular/core/testing';

import { RoleCreationService } from './role-creation.service';

describe('RoleCreationService', () => {
  let service: RoleCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
