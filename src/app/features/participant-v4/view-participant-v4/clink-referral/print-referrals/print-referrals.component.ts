import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddOrEditAppointmentModalComponent } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { TrackTabService } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { SrmService } from 'src/app/features/srm/srm.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { ParticipantV4Service } from '../../../participant-v4.service';


@Component({
  selector: 'app-print-referrals',
  templateUrl: './print-referrals.component.html',
  styleUrls: ['./print-referrals.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class PrintReferralsComponent implements OnInit {
  activityRefData: any;
  workerList: any = [];
  interventionList: any;
  appointmentList: any;
  userId: any;
  fname: string;
  printReferralsForm: FormGroup;
  prn: any;
  SU: any;
  userStatus: any;
  organisationList: any;
  outcomeList: any;
  profileUrl;
  allData;
  fundingList;

  constructor(public dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly srmService: SrmService,
    private readonly trackTabService: TrackTabService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly participantV4Service: ParticipantV4Service,
    public dialogRef: MatDialogRef<AddOrEditAppointmentModalComponent>,
    private readonly manageUsersService: ManageUsersService)
     {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.participantV4Service.getRefDataAllDetails().subscribe(data => {
        this.allData = data;  
        this.fundingList = data.refDataMap?.Funding_Type 
        console.log(this.fundingList,'funding list');
        
       })
  }

  ngOnInit(): void {
    this.setTitle();
    this.initForm();
    this.resolveKWList();
    this.getOrganisationList();
    this.getRefOutcomeData();
    this.getReferralList();
  }

  resolveKWList() {
    // let identifier;
    // if(this.profileUrl === 'mentivity-learner'){
    // identifier = 8;
    // }else if(this.profileUrl === 'clink-learners'){
    //   identifier = 16;
    // } else{
    //   identifier = 6;
    // }
    this.manageUsersService.getFilterUserList(16).subscribe(data=>{
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.workerList = data;
    })
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.userId = params.id;
        this.fname = params.fullName;
        this.prn=params.prn;
        this.SU=params.SU;
        this.userStatus=params.userStatus;
      }
    });
  }

  cancelPrint() {
    this.dialogRef.close();
  }

  onPrintReferrals(printReferralsForm) {
    const payload = printReferralsForm.getRawValue();
    payload.startDate = Utility.transformDateToString(printReferralsForm.controls.startDate.value);
    payload.endDate = Utility.transformDateToString(printReferralsForm.controls.endDate.value);
    payload.userId = parseInt(this.userId);
    this.participantV4Service.printReferrals(payload).subscribe(response => {
      const blob: any = new Blob([response.body], { type: response.headers.get("Content-Type") });
      this.download(blob, response.headers.get("X-Doc-Name"));
      this.dialogRef.close();
    }, error => {
      this.snackBarService.error(error.error.applicationMessage);
    });
  }

  private download(blob: Blob, name: string) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    const filename = name;
    a.download = filename;
    a.target = '_blank';
    const event = new MouseEvent('click', {
      'view': window,
      'bubbles': false,
      'cancelable': true
    });
    a.dispatchEvent(event);
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }


  printButtonDisabled(): boolean {
    return !this.printReferralsForm.valid;
  }

  initForm() {
    this.printReferralsForm = this.fb.group({
      interventionId: [[], [Validators.required]],
      workerId: [[], [Validators.required]],
      organisationId: [[], Validators.required],
      outcomeId: [null],
      startDate: [''],
      endDate: [''],
      fundingTypeId: [null]
    });
  }


  toggleAllInterventionSelection(interventions) {
    if (interventions._selected) {
      const interventionIds = this.interventionList.map(item => item.id)
      this.printReferralsForm.controls.interventionId
        .patchValue(interventionIds);
        interventions._selected = true;
    } else {
      this.printReferralsForm.controls.interventionId.patchValue([]);
      interventions._selected = false;
    }

  }
  toggleAllWorkerSelection(workers) {
    if (workers._selected) {
      const workerId = this.workerList.map(item => item.id)
      this.printReferralsForm.controls.workerId
        .patchValue(workerId);
        workers._selected = true;
    } else {
      this.printReferralsForm.controls.workerId.patchValue([]);
      workers._selected = false;
    }
  }
  
  toggleAllOrganisationSelection(organisations) {
    if (organisations._selected) {
      const orgId = this.organisationList.map(item => item.id)
      this.printReferralsForm.controls.organisationId
        .patchValue(orgId);
        organisations._selected = true;
    } else {
      this.printReferralsForm.controls.organisationId.patchValue([]);
      organisations._selected = false;
    }
  }

  toggleAllOutcomeSelection(outcomes) {
    if (outcomes._selected) {
      const orgId = this.outcomeList.map(item => item.id)
      this.printReferralsForm.controls.outcomeId
        .patchValue(orgId);
        outcomes._selected = true;
    } else {
      this.printReferralsForm.controls.outcomeId.patchValue([]);
      outcomes._selected = false;
    }
  }
  
  calculateMaxStartDate() {
    if (this.printReferralsForm.controls. endDate.value) {
      return moment(this.printReferralsForm.controls. endDate.value).subtract(1, 'days');
    } else {
      return null
    }
  }

  calculateMinPlannedEndDate() {
    if (this.printReferralsForm.controls.startDate.value) {
      return moment(this.printReferralsForm.controls.startDate.value).add(1, 'days');
    } else {
      return null
    }
  }

  getOrganisationList() {
    this.participantV4Service.getOrganisationDropdownList().subscribe(data => {
      this.organisationList = data;
    })
  }

  getReferralList() {
    this.participantV4Service.getReferralDropdownList().subscribe(data => {
      this.interventionList = data
    })
  }

  getRefOutcomeData() {
    this.participantV4Service.getRefOutcomeData().subscribe(data => {
      this.outcomeList = data;
    })
  }

  toggleAllFundingTypeSelection(fundingTyprSelection){
    if (fundingTyprSelection._selected) {
      const typeId = this.fundingList.map(item => item.id)
      this.printReferralsForm.controls.fundingTypeId
        .patchValue(typeId);
        fundingTyprSelection._selected = true;
    } else {
      this.printReferralsForm.controls.fundingTypeId.patchValue([]);
      fundingTyprSelection._selected = false;
    }

  }

}
