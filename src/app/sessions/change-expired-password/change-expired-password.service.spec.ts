import { TestBed } from '@angular/core/testing';

import { ChangeExpiredPasswordService } from './change-expired-password.service';

describe('ChangeExpiredPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangeExpiredPasswordService = TestBed.get(ChangeExpiredPasswordService);
    expect(service).toBeTruthy();
  });
});
