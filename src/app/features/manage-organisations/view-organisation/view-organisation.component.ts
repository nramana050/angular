import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SnackBarService } from './../../../framework/service/snack-bar.service';
import { ManageOrganisationsService } from '../manage-organisations.service';

@Component({
  selector: 'app-view-organisation',
  templateUrl: './view-organisation.component.html',
  styleUrls: ['./view-organisation.component.scss']
})
export class ViewOrganisationComponent implements OnInit {

  organisationData: any;
  organisationId: any;

  constructor(
    private readonly manageOrganisationsService: ManageOrganisationsService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.resolveOrganisationId();
    this.resolveOrganisationData();
  }

  resolveOrganisationId() {
    this.route.params.subscribe((params: any) => {
      this.organisationId = params.id;
    });
  }

  resolveOrganisationData() {
    this.manageOrganisationsService.getOrganisationById(this.organisationId).subscribe((data: any) => {
      this.organisationData = data;
    }, error => {
      this.location.back();
      this.snackBarService.error(error.error.applicationMessage);
    });
  }

}
