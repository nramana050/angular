import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from 'angular-calendar';
import * as moment from 'moment';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { AddOrEditAppointmentModalComponent } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { TrackTabService } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { MentivityService } from 'src/app/features/mentivity-learners/mentivity-learners.service';
import { SrmService } from 'src/app/features/srm/srm.service';
import { APP_DATE_FORMATS, AppDateAdapter } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-print-case-notes-v2',
  templateUrl: './print-case-notes-v2.component.html',
  styleUrls: ['./print-case-notes-v2.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check' } },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, useStrict: true } }
  ]
})
export class PrintCaseNotesV2Component implements OnInit {
  workerList: any = [];
  caseNoteActivityList: any = [];
  appointmentList: any;
  userId: any;
  fname: string;
  printcaseNoteForm: FormGroup;
  prn: any;
  SU: any;
  userStatus: any;

  constructor(public dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly srmService: SrmService,
    private readonly trackTabService: TrackTabService,
    private readonly capterLearnerServices: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<AddOrEditAppointmentModalComponent>,
    private readonly manageUsersService: ManageUsersService,
    private readonly mentivityService: MentivityService
  ) {
  }

  ngOnInit(): void {
    this.setTitle();
    this.initForm();
    this.resolveActivityRefData();
    this.resolveKWList();
  }

  async resolveKWList() {
    this.workerList = await this.manageUsersService.getFilterUserList(19).toPromise()
    this.workerList.forEach((users: any) => {
      Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
    });
  }

  resolveActivityRefData() {
    this.caseNoteActivityList = Utility.filterMapByKey("Case_Note_Activity");
  
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.userId = params.id;
        this.fname = params.fullName;
        this.prn = params.prn;
        this.SU = params.SU;
        this.userStatus = params.userStatus;
      }
    });
  }

  cancelPrint() {
    this.dialogRef.close();
  }

  onPrintCase(printcaseNoteForm) {
    const payload = printcaseNoteForm.getRawValue();
    payload.startDate = Utility.transformDateToString(printcaseNoteForm.controls.startDate.value);
    payload.endDate = Utility.transformDateToString(printcaseNoteForm.controls.endDate.value);
    payload.userId = parseInt(this.userId);
    this.mentivityService.printcaseNote(payload).subscribe(response => {
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
    return !this.printcaseNoteForm.valid;
  }

  initForm() {
    this.printcaseNoteForm = this.fb.group({
      activityIdList: ['', [Validators.required]],
      noteSenderId: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
    });
  }


  toggleAllActivitySelection(activities) {
    if (activities._selected) {
      const activityIds = this.caseNoteActivityList.map(item => item.id)
      this.printcaseNoteForm.controls.activityIdList
        .patchValue(activityIds);
        activities._selected = true;
    } else {
      this.printcaseNoteForm.controls.activityIdList.patchValue([]);
      activities._selected = false;
    }

  }
  toggleAllWorkerSelection(Worker) {
    if (Worker._selected) {
      const noteSenderId = this.workerList.map(item => item.id)
      this.printcaseNoteForm.controls.noteSenderId
        .patchValue(noteSenderId);
      Worker._selected = true;
    } else {
      this.printcaseNoteForm.controls.noteSenderId.patchValue([]);
      Worker._selected = false;
    }

  }
  calculateMaxStartDate() {
    if (this.printcaseNoteForm.controls.endDate.value) {
      return moment(this.printcaseNoteForm.controls.endDate.value).subtract(1, 'days');
    } else {
      return null
    }
  }

  calculateMinPlannedEndDate() {
    if (this.printcaseNoteForm.controls.startDate.value) {
      return moment(this.printcaseNoteForm.controls.startDate.value).add(1, 'days');
    } else {
      return null
    }
  }



}