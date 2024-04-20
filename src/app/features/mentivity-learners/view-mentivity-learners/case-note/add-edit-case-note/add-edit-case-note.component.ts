import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { Utility } from 'src/app/framework/utils/utility';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { ErrorMessage } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/file-validation.service';
import { TrackTabService } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { MentivityService } from '../../../mentivity-learners.service'
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-add-edit-case-note',
  templateUrl: './add-edit-case-note.component.html',
  styleUrls: ['./add-edit-case-note.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddEditCaseNoteComponent implements OnInit, OnDestroy, AfterViewChecked {

  caseNoteForm: FormGroup;
  maxDateOfBirth = new Date();
  minDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  workerList: any[] = [];
  activityRefData: any;
  interventionList: any[];
  name: any;
  SU: any;
  caseNote: boolean;
  id: number;
  UserId: any;
  updateFlag: boolean = false;
  btnTitle: any;
  caseNoteId: any;
  isOtherIntervention: boolean = false;
  isOtherType: boolean = false;
  errors: ErrorMessage[] = [];
  isValidate: boolean = false;

  currentDate1 = new Date();
  hours = [
    { value: 0, label: '00' }, { value: 1, label: '01' }, { value: 2, label: '02' }, { value: 3, label: '03' }, { value: 4, label: '04' }, { value: 5, label: '05' },
    { value: 6, label: '06' }, { value: 7, label: '07' }, { value: 8, label: '08' }, { value: 9, label: '09' }, { value: 10, label: '10' }, { value: 11, label: '11' },
    { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' }, { value: 15, label: '15' }, { value: 16, label: '16' }, { value: 17, label: '17' },
    { value: 18, label: '18' }, { value: 19, label: '19' }, { value: 20, label: '20' }, { value: 21, label: '21' }, { value: 22, label: '22' }, { value: 23, label: '23' },
  ];

  minutes = ['00', '15', '30', '45'];
  appointmentList: any[];
  difference: number;
  startTimeHour: number;
  endTimeHour: number;
  startTimeMinute: number;
  endTimeMinute: number;
  differenceHour: number;
  differenceMinute: number;
  timeLabel: string;
  differenceHour1: string;
  differenceMinute1: string;
  newDate: any;
  url;
  disableFlag :boolean;
  new:boolean =true;
  profileUrl;
  fName;

  constructor(
    private readonly trackTabService: TrackTabService,
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly learnersService: LearnersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly inPageNavService: InPageNavService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly manageUsersService: ManageUsersService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly mentivityService: MentivityService

  ) {
    this.setTitle();
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu1);
   }

   async ngOnInit() {
    this.initForm();
    this.resolveActivityRefData();
    this.resolveEditData();

    const userType = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userType;
    this.disableFlag = userType === 1 ? false : true;
  
    const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;
//  8  or 15
    const userData = await this.manageUsersService.getFilterUserList(this.getUrlForCaseNote()).toPromise();

    const result = userData.filter((user: any) => user.id == userId);

      if (result.length > 0 ) {
        const value = [{"id": result[0].id, "userFullName": result[0].firstName + ' ' + result[0].lastName}];
        this.workerList = value;
        this.caseNoteForm.get('noteSenderId')?.setValue(result[0].id);
      } else {
        userData.forEach((user: any) => {
          Object.assign(user, { userFullName: user.firstName + ' ' + user.lastName });
        });
        this.workerList = userData;
      }
    
    this.initConditionalFormValidators();
  }
  getUrlForCaseNote(): number {
    if(this.profileUrl === 'clink-learners'){
     return 15;
    }else{
      return 8;
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.UserId = params.id
      this.fName = params.name
      this.btnTitle = params.title;
      this.caseNoteId = params.caseNoteId;
      if (this.btnTitle === 'Update') {
        this.updateFlag = true;
      }
    })
  }

  initForm() {
    this.caseNoteForm = this.fb.group({
      id: null,
      noteText: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3000)]],
      noteSenderId: ['', [Validators.required]],
      noteToId: this.UserId,
      interventionId: ['', [Validators.required]],
      otherIntervention: [null, [Validators.minLength(1), Validators.maxLength(100)]],
      date: [null, [Validators.required]],
      timeHours: [null, [Validators.required]],
      timeMinutes: [null, [Validators.required]],
      endTimeHours: [null,],
      endTimeMinutes: [null],
      typeId: ['', [Validators.required]],
      otherType: [null, [Validators.minLength(1), Validators.maxLength(100)]],
    });
  }

  resolveActivityRefData() {
    this.trackTabService.getActivityRefData().subscribe(data => {
      this.activityRefData = data;
      this.interventionList = this.activityRefData.interventionList;
      this.appointmentList = this.activityRefData.appointmentList
    })
  }

  onSubmit(userForm) {
    if (!this.updateFlag) {
      this.onSaveCase(userForm);
    } else {
      this.onUpdateCase(userForm);
    }
  }

  onSelection(event) {
    
    if(this.interventionList.filter(data => data.name === 'Other')[0].id === event.value) {
      this.isOtherIntervention = true;
    }
    else {
      this.isOtherIntervention = false;
      this.caseNoteForm.get('otherIntervention').reset();
      this.caseNoteForm.get('otherIntervention').clearValidators();
      this.caseNoteForm.get('otherIntervention').updateValueAndValidity();
    }
  }

  onTypeChange(event) {
    if (this.appointmentList.filter(data => data.name === 'Other')[0].id === event.value) {
      this.isOtherType = true;
    }
    else {
      this.isOtherType = false;
      this.caseNoteForm.get('otherType').reset();
      this.caseNoteForm.get('otherType').clearValidators();
      this.caseNoteForm.get('otherType').updateValueAndValidity();
    }
  }

  cancelAddCaseNote() {
    this.router.navigate([this.profileUrl +'/case-note'], { queryParams:  {id: this.UserId, name: this.fName}, queryParamsHandling: 'merge' }); 
  }

  onSaveCase(userForm) {
    const payload = userForm.getRawValue();
    payload.startTime = this.formatCaseNoteTime(userForm.controls.timeHours.value, userForm.controls.timeMinutes.value);
    payload.endTime = this.formatCaseNoteTime(userForm.controls.endTimeHours.value, userForm.controls.endTimeMinutes.value);
    payload.date = Utility.dateToString(payload.date);
    if (this.caseNoteForm.get('endTimeHours').value != null && this.caseNoteForm.get('endTimeMinutes').value != null) {
      payload.endTime = this.formatCaseNoteTime(userForm.controls.endTimeHours.value, userForm.controls.endTimeMinutes.value);
    }
    else {
      payload.endTime = null;
    }
    this.mentivityService.createUserCaseNote(payload).subscribe(response => {
      this.location.back();
      this.snackBarService.success(response.message.applicationMessage);
    }, error => {
      this.snackBarService.error(`${error.errorMessage}`);
    });
  }

  onUpdateCase(userForm) {
    const payload = userForm.getRawValue();
    payload.id = parseInt(this.caseNoteId);
    payload.startTime = this.formatCaseNoteTime(userForm.controls.timeHours.value, userForm.controls.timeMinutes.value);
    payload.endTime = this.formatCaseNoteTime(userForm.controls.endTimeHours.value, userForm.controls.endTimeMinutes.value);
    payload.date = Utility.dateToString(payload.date);
    if (this.caseNoteForm.get('endTimeHours').value != null && this.caseNoteForm.get('endTimeMinutes').value != null) {
      payload.endTime = this.formatCaseNoteTime(userForm.controls.endTimeHours.value, userForm.controls.endTimeMinutes.value);
    }
    else {
      payload.endTime = null;
    }
    this.mentivityService.updateUserCaseNote(payload).subscribe(response => {
      this.location.back();
      this.snackBarService.success(response.message.applicationMessage);
    }, error => {
      this.snackBarService.error(`${error.errorMessage}`);
    });
  }


   resolveEditData() {
    if (this.updateFlag) {
      this.new == false;
      this.mentivityService.getUserCaseNote(this.caseNoteId).subscribe(data => {
        if (data.otherIntervention !== null) {
          this.isOtherIntervention = true;
          this.caseNoteForm.get('otherIntervention').patchValue(data.otherIntervention)
        } else {
          this.isOtherIntervention = false;
        }
        if (data.otherType !== null) {
          this.isOtherType = true;
          this.caseNoteForm.get('otherType').patchValue(data.otherType)
        } else {
          this.isOtherType = false;
        }
        this.caseNoteForm.get('noteText').patchValue(data.noteText);
        this.caseNoteForm.get('noteSenderId').patchValue(data.noteSenderId);
        this.caseNoteForm.get('interventionId').patchValue(data.interventionId);
        this.caseNoteForm.get('typeId').patchValue(data.typeId);
        this.newDate = Utility.transformDateToString(data.date);
        this.caseNoteForm.controls.date.setValue(moment(this.newDate));;
        const meetingTimeSplitArr = data.startTime.split(':');
        const hoursArrIndexOfAppointment = this.hours.findIndex(hour => hour.label === meetingTimeSplitArr[0])
        this.caseNoteForm.controls.timeHours.patchValue(this.hours[hoursArrIndexOfAppointment].value);
        const minutesArrIndexOfAppointment = this.minutes.findIndex(minute => minute === meetingTimeSplitArr[1])
        this.caseNoteForm.controls.timeMinutes.patchValue(this.minutes[minutesArrIndexOfAppointment]);
        if (this.caseNoteForm.controls.endTimeHours != null && this.caseNoteForm.controls.endTimeMinutes != null) {
          const meetingEndTimeSplitArr = data.endTime.split(':');
          const _hoursArrIndexOfAppointment = this.hours.findIndex(hour => hour.label === meetingEndTimeSplitArr[0])
          this.caseNoteForm.controls.endTimeHours.patchValue(this.hours[_hoursArrIndexOfAppointment].value);
          const _minutesArrIndexOfAppointment = this.minutes.findIndex(minute => minute === meetingEndTimeSplitArr[1])
          this.caseNoteForm.controls.endTimeMinutes.patchValue(this.minutes[_minutesArrIndexOfAppointment]);
        }
      })
    }
  }

  formatCaseNoteTime(timeHours, timeMinutes) {
    if (timeHours !== undefined && timeMinutes !== undefined) {
      const timeHoursString = `${timeHours}`;
      if (timeHoursString.length === 1) {
        return `0${timeHours}:${timeMinutes}`
      } else {
        return `${timeHours}:${timeMinutes}`
      }
    }
    return null;
  }

  navigateHome() {
    this.router.navigate(['./service-user/case-note']);
  }

  activityTabs(tabName: string) {
    this.router.navigate(['/service-user/case-note/case-note'],
      { queryParams: { id: this.UserId, name: this.name, SU: this.SU } });
  }

  addButtonDisabled(): boolean {
    return !this.caseNoteForm.valid;
  }

  public getErrors(): ErrorMessage[] {
    return this.errors;
  }
  public clearError() {
    this.errors = [];
  }

  validateMeetingStartAndEndTime() {
    this.clearError();
    const mEndHrs = this.caseNoteForm.controls.endTimeHours.value;
    const mEndMin = this.caseNoteForm.controls.endTimeMinutes.value;
    this.clearError();
    const year = moment(this.caseNoteForm.controls.date.value).year();
    const month = moment(this.caseNoteForm.controls.date.value).month();
    const day = moment(new Date(), "day").date();
    const mStartHrs = this.caseNoteForm.controls.timeHours.value;
    const mStartMin = this.caseNoteForm.controls.timeMinutes.value;
    const mStartTime = moment(`${year}-${month + 1}-${day} ${mStartHrs}:${mStartMin}:${'00'}`);
    const mEndTime = moment(`${year}-${month + 1}-${day} ${mEndHrs}:${mEndMin}:${'00'}`)
    if (mStartTime.isSame(mEndTime) && mStartTime !== null && mEndTime !== null) {
      const error = { id: 'InvalidTime', message: 'Meeting start time and end time cannot be same' }
      this.errors.push(error);
      this.caseNoteForm.controls['endTimeHours'].setErrors({ 'incorrect': true });
      this.caseNoteForm.controls['endTimeMinutes'].setErrors({ 'incorrect': true });
      this.caseNoteForm.markAsTouched();
      this.isValidate = false;
      return false;
    }
    else if (mEndTime.isBefore(mStartTime) && mStartTime !== null && mEndTime !== null) {
      this.caseNoteForm.controls['endTimeHours'].setErrors({ 'incorrect': true });
      this.caseNoteForm.controls['endTimeHours'].markAsTouched();
      this.caseNoteForm.controls['endTimeMinutes'].setErrors({ 'incorrect': true });
      this.caseNoteForm.controls['endTimeMinutes'].markAsTouched();

      const error = { id: 'InvalidMettingTime', message: 'Meeting end time cannot be before start time' }
      this.errors.push(error);
      this.isValidate = false;
      return false;
    }
    else if (mEndHrs !== null && mEndMin !== null) {
      const caseNoteEndDateAndTime = moment(`${mEndHrs}:${mEndMin}`)
      if (caseNoteEndDateAndTime.isAfter()) {
        this.caseNoteForm.controls['endTimeHours'].setErrors({ 'incorrect': true });
        this.caseNoteForm.controls['endTimeHours'].markAsTouched();
        this.caseNoteForm.controls['endTimeMinutes'].setErrors({ 'incorrect': true });
        this.caseNoteForm.controls['endTimeMinutes'].markAsTouched();
        const error = { id: 'InvalidTime', message: 'The end time cannot be in the future' }
        this.errors.push(error);
        this.isValidate = false;
        return false;
      }
    }
    this.isValidate = true;
    return true;
  }

  initConditionalFormValidators() {
    this.caseNoteForm.get('timeHours').valueChanges.subscribe(value => {
      this.validateMeetingStartAndEndTime();
      if (this.isValidate) {
        this.caseNoteForm.get('endTimeHours').setValue(this.caseNoteForm.get('endTimeHours').value);
        this.caseNoteForm.get('endTimeMinutes').setValue(this.caseNoteForm.get('endTimeMinutes').value);
      }
    })
    this.caseNoteForm.get('timeMinutes').valueChanges.subscribe(value => {
      this.validateMeetingStartAndEndTime();
    })
    this.caseNoteForm.get('endTimeHours').valueChanges.subscribe(value => {
      this.validateMeetingStartAndEndTime();
    })
    this.caseNoteForm.get('endTimeMinutes').valueChanges.subscribe(value => {
      this.validateMeetingStartAndEndTime();
    })
  }

}

