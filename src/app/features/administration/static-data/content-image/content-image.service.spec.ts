import { TestBed } from '@angular/core/testing';

import { ContentImageService } from './content-image.service';

describe('ContentImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentImageService = TestBed.get(ContentImageService);
    expect(service).toBeTruthy();
  });
});
