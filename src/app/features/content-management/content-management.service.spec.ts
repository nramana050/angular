import { TestBed } from '@angular/core/testing';

import { ContentManagementService } from './content-management.service';

describe('ContentManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentManagementService = TestBed.get(ContentManagementService);
    expect(service).toBeTruthy();
  });
});
