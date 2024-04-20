import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { ManageOrganisationsService } from '../manage-organisations.service';

@Component({
  selector: 'app-add-edit-organisation',
  templateUrl: './add-edit-organisation.component.html',
  styleUrls: ['./add-edit-organisation.component.scss']
})
export class AddEditOrganisationComponent implements OnInit {
  
  routeIntent: string;
  organisationForm: FormGroup;
  telephoneCodePattern = /^(\d{7}|\d{11})$/;
  emailPattern = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly manageOrganisationsService: ManageOrganisationsService,
    private readonly snackBar: SnackBarService
  ) { }

  ngOnInit() {
    this.resolveRouteIntent();
    this.initOrganisationForm();
  }

  resolveRouteIntent() {
    if (this.activatedRoute.snapshot.data['title'] === 'Edit Organisation') {
      this.routeIntent = 'editOrganisation';
    } else {
      this.routeIntent = 'newOrganisation';
    }
  }

  initOrganisationForm() {
    this.organisationForm = this.fb.group({
      id: '',
      contactEmail: ['', [Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      contactTelephone: ['', [Validators.maxLength(18), Validators.pattern(this.telephoneCodePattern)]],
      isClientPrimary: [false],
      lotName: ['', Validators.maxLength(100)],
      organizationName: [null, [Validators.required, Validators.maxLength(100)]],
    });

    if (this.routeIntent === 'editOrganisation') {
      this.activatedRoute.params.subscribe((params: any) => {
        this.manageOrganisationsService.getOrganisationById(params.id).subscribe(organisationData => {
          this.organisationForm.patchValue(organisationData);
        })
      })
    }
  }

  onSubmit() {
    const payload = this.organisationForm.getRawValue()
    if (payload.contactEmail==''){
      payload.contactEmail=null
    }
    if (this.routeIntent === 'newOrganisation') {
      this.onCreateOrganisation(payload);
    } else if (this.routeIntent === 'editOrganisation') {
      this.onUpdateOrganisation(payload);
    }
  }

  onCreateOrganisation(payload) {
    this.manageOrganisationsService.createOrganisation(payload).subscribe(response => {
      this.snackBar.success(response.message.applicationMessage);
      this.router.navigateByUrl('/application-setup/manage-organisations');
    }, error => {
      this.snackBar.error(error.error.applicationMessage);
    })
  }

  onUpdateOrganisation(payload) {
    this.manageOrganisationsService.updateOrganisation(payload).subscribe(response => {
      this.snackBar.success(response.message.applicationMessage);
      this.router.navigateByUrl('/application-setup/manage-organisations');
    }, error => {
      this.snackBar.error(error.error.applicationMessage);
    })
  }

}
