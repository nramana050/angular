import { TestBed } from '@angular/core/testing';

import { ContentCategoryService } from './content-category.service';

describe('ContentCategoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentCategoryService = TestBed.get(ContentCategoryService);
    expect(service).toBeTruthy();
  });
});
