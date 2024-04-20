import { Component, OnDestroy, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferralService } from '../referral.service';
import { SrmService } from 'src/app/features/srm/srm.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { APP_DATE_FORMATS, AppDateAdapter } from 'src/app/framework/components/date-adapter/date-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Utility } from 'src/app/framework/utils/utility';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-add-referral',
  templateUrl: './add-referral.component.html',
  styleUrls: ['./add-referral.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddReferralComponent implements OnInit, OnDestroy, AfterViewChecked {

  referralForm: FormGroup;
  name: any;
  userId: any;
  referralList: any;
  workerList: any = []
  organisationList: any;
  outcomeList: any;
  isNew: boolean;
  editData: any;
  profileUrl;
  disableFlag :boolean;
 
  constructor(
    private readonly fb: FormBuilder,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly referrralService: ReferralService,
    private readonly srmService: SrmService,
    private readonly snackBarService: SnackBarService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly manageUsersService: ManageUsersService,
    private readonly pageNav: InPageNavService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.pageNav.setNavItems(this.learnerNavigation.learnerSubMenu1);
    this.setTitle();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  async ngOnInit(): Promise<void> {
    this.getReferralList();
    this.getOrganisationList();
    this.getRefOutcomeData();
    this.manageUsersService.getFilterUserList(6).subscribe(userData=>{
      userData.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.workerList = userData;
    })

  }

  setTitle() {
    this.inItReferralForm();
    this.route.queryParams.subscribe((params: any) => {
      this.isNew = true
      if (params.referralId) {
        this.isNew = false
        this.onEditReffClicked(params.referralId)
      }
      this.name = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.name}`;
    });
  }

  inItReferralForm() {
    this.referralForm = this.fb.group({
      interventionId: [null,],
      userId: [null,],
      referralDate: [null,],
      workerId: [null,],
      notes: [null, [Validators.minLength(3)]],
      otherIntervention: [null, [Validators.minLength(3)]],
      organisationId: [null,],
      otherOrganisation: [null, [Validators.minLength(3)]],
      refOutcomeId: []
    })
  }

  getReferralList() {
    this.referrralService.getReferralDropdownList().subscribe(data => {
      this.referralList = data
    })
  }

  getOrganisationList() {
    this.referrralService.getOrganisationDropdownList().subscribe(data => {
      this.organisationList = data;
    })
  }

  getRefOutcomeData() {
    this.referrralService.getRefOutcomeData().subscribe(data => {
      this.outcomeList = data;
    })
  }

  onSubmit() {
    this.isNew ? this.addReferral() : this.updateReferral();
  }

  addReferral() {
    let date = this.referralForm.get('referralDate').value
    date = Utility.transformDateToString(date)
    this.referralForm.get('referralDate').setValue(date)
    const payload = this.referralForm.value;
    payload.id = 0;
    payload.userId = this.userId;
    this.referrralService.addReferral(payload).subscribe(result => {
      this.snackBarService.success(result.message.applicationMessage);
      this.router.navigate(['/captr-learner/referral'], { queryParams: { id: this.userId, name: this.name } })
    },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  updateReferral() {
    let payload = this.referralForm.value;
    payload.id = this.editData.id
    payload.userId = this.userId
    this.isOtherReferral(payload.interventionId)? payload.otherIntervention:payload.otherIntervention = null;
    this.isOtherOrganisation(payload.organisationId)? payload.otherOrganisation : payload.otherOrganisation = null;
    this.referrralService.updateReferral(payload).subscribe(data => {
      this.snackBarService.success(data.message.applicationMessage);
      this.router.navigate(['/captr-learner/referral'], { queryParams: { id: this.userId, name: this.name } })
    },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }


  onEditReffClicked(id) {
    this.referrralService.editReferral(id).subscribe(data => {
      this.editData = data;
      let referralDate = Utility.transformDateToString(data.referralDate);
      this.referralForm.get('referralDate').setValue(referralDate)
      this.referralForm.get('notes').setValue(data.notes)
      this.referralForm.get('otherIntervention').setValue(data.otherIntervention)
      this.referralForm.get('interventionId').setValue(data.interventionId)
      this.referralForm.get('workerId').setValue(data.workerId)
      this.referralForm.get('otherOrganisation').setValue(data.otherOrganisation)
      this.referralForm.get('organisationId').setValue(data.organisationId)
      this.referralForm.get('refOutcomeId').setValue(data.refOutcomeId)
    })
  }

  isOtherReferral(id) {

    let referral = this.referralList?.filter(data => data.id === id)[0];
    if (referral?.identifier.includes('OTR')) {
      return true;
    }
    return false;
  }

  isOtherOrganisation(id) {
    let organisation = this.organisationList?.filter(data => data.id === id)[0];
    if (organisation?.identifier.includes('OTH')) {
      return true;
    }
    return false;
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'], { queryParamsHandling :"merge"});
   }
}
