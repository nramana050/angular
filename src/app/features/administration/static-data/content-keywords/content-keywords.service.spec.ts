import { TestBed } from '@angular/core/testing';

import { ContentKeywordsService } from './content-keywords.service';

describe('ContentKeywordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentKeywordsService = TestBed.get(ContentKeywordsService);
    expect(service).toBeTruthy();
  });
});
