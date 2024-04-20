import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUsefulContact } from '../usefulContact.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { error } from 'console';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-add-edit-useful-contacts',
  templateUrl: './add-edit-useful-contacts.component.html',
  styleUrls: ['./add-edit-useful-contacts.component.scss']
})
export class AddEditUsefulContactsComponent implements OnInit, OnDestroy {
  routeIntent: string;
  usefulContactForm: FormGroup;
  formData: IUsefulContact;

  isNew = false;

  workerNamePattern =/^[a-zA-Z]+( [a-zA-Z]+)?$/;
  emailPattern = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  telephonePattern = /^(\d{7}|\d{11})$/;
  serviceUserId: number = null;
  organizationNamePattern=/^(?! )[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
  profileUrl;

  constructor(
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly snackBarService: SnackBarService,
    private readonly router: Router,
    private route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
   }

  ngOnInit(): void {
    this.resolveRouteIntent();
    this.initUsefulContactForm();
  }

  resolveRouteIntent() {
    this.createUsefulContactForm();
    const constactId = this.route.snapshot.paramMap.get('contactId');
    if (constactId === null) {
      this.routeIntent = 'newUsefulContact';
      this.isNew = true;
    } else {
      this.routeIntent = 'editUsefulContact';
      this.isNew = false;
    }
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('contactId')) {
        this.serviceUserId = params.id;
      } else {
        this.serviceUserId = params.id;
      }
    });
  }


  initUsefulContactForm() {
    const constactId = this.route.snapshot.paramMap.get('contactId');
    if (constactId !== null) {
      this.captrLearnersService.getUsefulContactDetails(+constactId)
        .subscribe((data: any) => {
          this.usefulContactForm.patchValue(data);
          this.isNew = false;
        },
          error => {
            this.snackBarService.error(`${error.error.applicationMessage}`);
            this.navigateHome();
          });
    }
  }


  createUsefulContactForm() {
    this.usefulContactForm = this.fb.group({
      id: [null],
      workerName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(this.workerNamePattern)]],
      organisation: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.organizationNamePattern)]],
      telephoneNumber: [null, [Validators.pattern(this.telephonePattern)]],
      email: [null, [Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      address: [null, [Validators.maxLength(100)]],
      notes: [null, [Validators.maxLength(500)]],
      createdDate: [null]
    })
  }

  navigateHome() {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    this.isNew ? this.createUsefulContact() : this.updateUsefulContact();
  }

  createUsefulContact() {
    const payload = this.usefulContactForm.getRawValue();
    payload.serviceUserId = this.serviceUserId;
    this.captrLearnersService.createUsefulContactDetails(payload).subscribe((data: any) => {
      this.snackBarService.success(data.message.applicationMessage);
      this.router.navigate([this.profileUrl+'/useful-contacts'], { queryParamsHandling: 'preserve' });
    }, error => {
      this.snackBarService.error(error.error.applicationMessage)
    })
  }

  updateUsefulContact() {
    const payload = this.usefulContactForm.getRawValue();
    if (payload.telephoneNumber === "") {
      payload.telephoneNumber = null;
    }
    if (payload.email === "") {
      payload.email = null;
    }
    payload.serviceUserId = this.serviceUserId;
    this.captrLearnersService.updateUsefulContactDetails(payload).subscribe((data: any) => {
      this.snackBarService.success(data.message.applicationMessage);
      this.router.navigate([this.profileUrl +'/useful-contacts'], { queryParamsHandling: 'preserve' });
    }, error => {
      this.snackBarService.error(error.error.applicationMessage)
    })
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl +'/useful-contacts'], { queryParamsHandling: 'preserve' });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

}