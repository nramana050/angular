/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ManageOrganisationsService } from './manage-organisations.service';

describe('Service: ManageOrganisations', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageOrganisationsService]
    });
  });

  it('should ...', inject([ManageOrganisationsService], (service: ManageOrganisationsService) => {
    expect(service).toBeTruthy();
  }));
});
