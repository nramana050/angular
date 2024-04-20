import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { ReferralService } from 'src/app/features/captr-learners/view-captr-learner/referral/referral.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { SrmService } from 'src/app/features/srm/srm.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-add-edit-referral-v2',
  templateUrl: './add-edit-referral-v2.component.html',
  styleUrls: ['./add-edit-referral-v2.component.scss']
})
export class AddEditReferralV2Component implements OnInit, OnDestroy, AfterViewChecked {

  referralForm: FormGroup;
  name: any;
  userId: any;
  activityList: any = [];
  workerList: any = []
  organisationList: any;
  outcomeList: any;
  isNew: boolean;
  editData: any;
  profileUrl;
  disableFlag: boolean;

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
    this.getActivityList();
    this.getOrganisationList();
    this.getRefOutcomeData();
    const userType = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userType;
    this.disableFlag = userType === 1 ? false : true;
    const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;
    const userData = await this.manageUsersService.getFilterUserList(4).toPromise();
    const result = userData.filter((user: any) => user.id == userId);
    if (result.length > 0) {
      const value = [{ "id": result[0].id, "userFullName": result[0].firstName + ' ' + result[0].lastName }];
      this.workerList = value;
      this.referralForm.get('workerId')?.setValue(result[0].id);
    } else {
      userData.forEach((user: any) => {
        Object.assign(user, { userFullName: user.firstName + ' ' + user.lastName });
      });
      this.workerList = userData;
    }
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
      activityId: [null, Validators.required],
      userId: [null],
      referralDate: [null,],
      workerId: [null,],
      notes: [null, [Validators.minLength(3)]],
      organisationId: [null,],
      otherOrganisation: [null, [Validators.minLength(3)]],
      refOutcomeId: []
    })
  }

  getActivityList() {
    let caseNoteActivites = Utility.filterMapByKey("Case_Note_Activity");
    this.activityList = caseNoteActivites.filter(ref => ref.identifier !== 'AFH')
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
      this.router.navigate(['/person-supported/referral'], { queryParams: { id: this.userId, name: this.name } })
    },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  updateReferral() {
    let payload = this.referralForm.value;
    payload.id = this.editData.id
    payload.userId = this.userId
    this.isOtherOrganisation(payload.organisationId) ? payload.otherOrganisation : payload.otherOrganisation = null;
    this.referrralService.updateReferral(payload).subscribe(data => {
      this.snackBarService.success(data.message.applicationMessage);
      this.router.navigate(['/person-supported/referral'], { queryParams: { id: this.userId, name: this.name } })
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
      this.referralForm.get('activityId').setValue(data.activityId)
      this.referralForm.get('workerId').setValue(data.workerId)
      this.referralForm.get('otherOrganisation').setValue(data.otherOrganisation)
      this.referralForm.get('organisationId').setValue(data.organisationId)
      this.referralForm.get('refOutcomeId').setValue(data.refOutcomeId)
    })
  }

  isOtherOrganisation(id) {
    let organisation = this.organisationList?.filter(data => data.id === id)[0];
    if (organisation?.identifier.includes('OTH')) {
      return true;
    }
    return false;
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl + '/referral'], { queryParamsHandling: "merge" });
  }
}
