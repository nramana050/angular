import { TestBed } from '@angular/core/testing';

import { ManageUserV2Service } from './manage-user-v2.service';

describe('ManageUserV2Service', () => {
  let service: ManageUserV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageUserV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
