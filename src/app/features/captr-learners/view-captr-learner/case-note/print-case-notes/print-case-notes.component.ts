import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { TrackTabService } from '../../plan-content-card/track-tab/track-tab.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { Utility } from 'src/app/framework/utils/utility';
import * as moment from 'moment';
import { AddOrEditAppointmentModalComponent } from '../../plan-content-card/track-tab/f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { SrmService } from 'src/app/features/srm/srm.service';


@Component({
  selector: 'app-print-case-notes',
  templateUrl: './print-case-notes.component.html',
  styleUrls: ['./print-case-notes.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class PrintCaseNotesComponent implements OnInit {

  activityRefData: any;
  workerList: any = [];
  interventionList: any;
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
    private readonly manageUsersService: ManageUsersService,) {
  }

  ngOnInit(): void {
    this.setTitle();
    this.initForm();
    this.resolveActivityRefData();
    this.resolveKWList();
  }

  async resolveKWList() {
    this.workerList = await this.manageUsersService.getFilterUserList(4).toPromise()
    this.workerList.forEach((users: any) => {
      Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
    });
  }

  resolveActivityRefData() {
    this.trackTabService.getInterventionData().subscribe(data => {
      this.interventionList = data;
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

  onPrintCase(printcaseNoteForm) {
    const payload = printcaseNoteForm.getRawValue();
    payload.startDate = Utility.transformDateToString(printcaseNoteForm.controls.startDate.value);
    payload.endDate = Utility.transformDateToString(printcaseNoteForm.controls.endDate.value);
    payload.userId = parseInt(this.userId);
    this.capterLearnerServices.printcaseNote(payload).subscribe(response => {
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
      interventionId: ['', [Validators.required]],
      noteSenderId: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
    });
  }


  toggleAllIntervantionsSelection(intervantions) {
    if (intervantions._selected) {
      const interventionIds = this.interventionList.map(item => item.id)
      this.printcaseNoteForm.controls.interventionId
        .patchValue(interventionIds);
        intervantions._selected = true;
    } else {
      this.printcaseNoteForm.controls.interventionId.patchValue([]);
      intervantions._selected = false;
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
    if (this.printcaseNoteForm.controls. endDate.value) {
      return moment(this.printcaseNoteForm.controls. endDate.value).subtract(1, 'days');
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
