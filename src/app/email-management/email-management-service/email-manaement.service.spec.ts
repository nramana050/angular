import { TestBed } from '@angular/core/testing';

import { EmailManaementService } from './email-manaement.service';

describe('EmailManaementService', () => {
  let service: EmailManaementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailManaementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
