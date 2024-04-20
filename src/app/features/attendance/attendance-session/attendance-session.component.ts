import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';
import * as moment from 'moment';
import { AttendanceService } from '../attendance.service';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { forkJoin } from 'rxjs';
import { Utility } from 'src/app/framework/utils/utility';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Component({
  selector: 'app-attendance-session',
  templateUrl: './attendance-session.component.html',
  styleUrls: ['./attendance-session.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AttendanceSessionComponent implements OnInit {

  refData: any;
  attendanceForm: FormGroup;
  enrolledLearns: any[] = [];
  learners: any[] = [];
  noAnswers: number[] = [];
  learnerColumns: string[] = ['learnerName', 'D.O.B',  'attended']
  teacherList: any[] = [];
  isOccurred;
  isFutureDate = false;
  isOninit=false;
  day;


  readonly  OPERATIONAL_CLOSURE = 4;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly appConfirmService: AppConfirmService,
    private readonly snackBarService: SnackBarService,
    private readonly attendanceService: AttendanceService,
    private readonly manageUserService: ManageUsersService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.route.snapshot.data['title'] = `${params['name']} ( ${params['sessionName']})`;
    });
  }
  ngOnInit() {
    this.isOninit=true;
    this.initForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params) {
        this.day = params.day;
        const sessionParams = {
          sessionDate: params.day,
          sessionTypeId: params.sessionTypeId,
          programmeCourseDeliveryId: params.pcdId
        }

        this.attendanceForm.get('sessionId').setValue(params.sessionTypeId);
        this.attendanceForm.get('date').setValue(params.day);
        this.attendanceForm.get('prgorammeCourseDeliveryId').setValue(params.pcdId);
        this.checkForFutureDate(params.day);

        forkJoin([
          this.attendanceService.getLearnersForAttendance(sessionParams),
          this.attendanceService.getAttendanceRefData(),
          this.manageUserService.getAllSuUserByLggedInClient(),
          this.getTeacherList()       
        ]).subscribe((data: any) => {
          this.refData = data[1];
          this.learners = data[2]
          this.teacherList = data[3]
          this.teacherList.forEach(element => {
          element.fullName = element.firstName + " " + element.lastName;
          })
          this.isOccurred = data[0].hasOccurred;
          data[0].isOccurred = data[0].hasOccurred === null ? true : data[0].hasOccurred;
          this.attendanceForm.get('sessionNotes').setValue(data[0].sessionNotes);
          this.resolveSessionData(data[0]);
        });

      }
    });

  }

  private getTeacherList() {
    if (BaseUrl.CLIENT_URL.includes('rmf')) {
      return this.manageUserService.getUserDetailsByRoleIdentifierAndAppId(['CMPLTTR', 'RMFCMPLTTR'], localStorage.getItem('ApplicationID'));
    }
    else {
      return this.manageUserService.getFilterUserList(5);
    }
  }

  checkForFutureDate(date) {
    if(Utility.transformStringToMomentDate(date).isAfter(moment.now())) {
      this.isFutureDate = true;
    }
  }

  initForm() {
    this.attendanceForm = this.formBuilder.group({
      sessionId: [],
      date: [],
      hasOccurred: [],
      sessionNotes :[],
      notOccurredReseaonId:[],
      learnerList: new FormArray([]),
      teacher: [],
      prgorammeCourseDeliveryId: []
    });
  }


  get learnerListForm() {
    return this.attendanceForm.get('learnerList') as FormArray;
  }

  resolveSessionData(data) {
   this.attendanceForm.get('hasOccurred').setValue(data.hasOccurred === null ? true : data.hasOccurred);
    this.attendanceForm.get('teacher').setValue(data.tutorId)
    this.enrolledLearns = data.learners;
    if (data.hasOccurred === null || data.hasOccurred) {
      data.learners.forEach((learner, i) => {
        if (learner.attended === null) {
          learner.attendanceStatusId = this.getYesAttendedId();
        }
        this.learnerListForm.push(this.formBuilder.group(learner));
        this.change(i);
      });
    } else {
      this.sessionTakePlaceChange(data.hasOccurred);
      this.attendanceForm.get('notOccurredReseaonId').setValue(data.notOccurredReseaonId);
      this.attendanceForm.get('comment').setValue(data.comment);
    }
  }
  sessionTakePlaceChange(value) {
    while (this.learnerListForm.length) {
      this.learnerListForm.removeAt(0);
    }
    if (!value) {
      this.addControlInFormGroup('notOccurredReseaonId', this.attendanceForm, new FormControl('', Validators.required));
      this.attendanceForm.updateValueAndValidity();
    } else {
      if (this.attendanceForm.contains('notOccurredReseaonId')) {
        this.removeControlInFormGroup('notOccurredReseaonId', this.attendanceForm);
        this.enrolledLearns.forEach(learner => {
          if (learner.attended == null) {
            learner.attendanceStatusId = this.getYesAttendedId();
          }
          this.learnerListForm.push(this.formBuilder.group(learner));
        });
        this.attendanceForm.updateValueAndValidity();
      }
    }
  }

  onSubmit() {
    const payload = this.attendanceForm.value;
    this.attendanceService.saveAttendance(payload).subscribe(rsp => {
      this.attendanceForm.reset();
      this.router.navigate(['/attendance/list'], { queryParams: { day: this.day } });
      this.snackBarService.success(rsp.message.applicationMessage);

    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    );
  }

  change(index) {
    const currentFormGroup = this.learnerListForm.at(index) as FormGroup;
    const isAttended = currentFormGroup.get('attendanceStatusId').value;
    if (isAttended === this.getNoAttendedId()) {
      this.addControlInFormGroup('absenceTypeId', currentFormGroup, new FormControl('', [Validators.required]));
      this.noAnswers.push(currentFormGroup.get('learnerId').value);
    } else {
      this.removeControlInFormGroup('absenceTypeId', currentFormGroup);
      this.noAnswers.splice(this.noAnswers.indexOf(currentFormGroup.get('learnerId').value, 1));
    }
  }

  addControlInFormGroup(field, formGroup, formControl: FormControl) {
    formGroup.addControl(field, formControl);
    formGroup.addControl(field, formControl);
    formGroup.updateValueAndValidity();
  }

  removeControlInFormGroup(field, formGroup) {
    formGroup.removeControl(field);
    formGroup.updateValueAndValidity();
  }


  canDeactivate() {
    if (this.attendanceForm.dirty && this.attendanceForm.touched) {
      return this.appConfirmService.confirm({ title: `Session Attendance`, message: 'Any unsaved changes will be lost. Continue?' });
    }

    return true;
  }
  getYesAttendedId() {
    const attendedObj = Utility.getObjectFromArrayByKeyAndValue(this.refData.attendanceStatus, 'identifier', '1')
    return attendedObj.id;
  }

  getNoAttendedId() {
    const attendedObj = Utility.getObjectFromArrayByKeyAndValue(this.refData.attendanceStatus, 'identifier', '3')
    return attendedObj.id;
  }

  navigateToSessionListPage() {
    this.router.navigate(['/attendance/list'], { queryParams: { day: this.day } });
  }

  getValueById(id, column) {
    let value;
    const learner = Utility.getObjectFromArrayByKeyAndValue(this.learners, 'id', id)

    if (learner) {
      switch (column) {
        case 'NAME':
          value = learner.firstName + " " + learner.lastName;
          break;

        case 'DOB':
          value = learner.dateOfBirth;
          break;
      }

    }
    return value
  }
}
