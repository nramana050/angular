import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../../../framework/components/date-adapter/date-adapter';
import * as moment from 'moment';
import { TrackTabService } from '../../track-tab.service';
import { ErrorInput, ErrorMessage } from '../../file-validation.service';
import { ManageUsersService } from '../../../../../../manage-users/manage-users.service';

@Component({
  selector: 'app-add-or-edit-appointment-modal',
  templateUrl: './add-or-edit-appointment-modal.component.html',
  styleUrls: ['./add-or-edit-appointment-modal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddOrEditAppointmentModalComponent implements OnInit, AfterViewChecked {
  addOrUpdateAppointmentForm: FormGroup;
  currentDate = new Date();
  hours = [
    { value: 0, label: '00' }, { value: 1, label: '01' }, { value: 2, label: '02' }, { value: 3, label: '03' }, { value: 4, label: '04' }, { value: 5, label: '05' },
    { value: 6, label: '06' }, { value: 7, label: '07' }, { value: 8, label: '08' }, { value: 9, label: '09' }, { value: 10, label: '10' }, { value: 11, label: '11' },
    { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' }, { value: 15, label: '15' }, { value: 16, label: '16' }, { value: 17, label: '17' },
    { value: 18, label: '18' }, { value: 19, label: '19' }, { value: 20, label: '20' }, { value: 21, label: '21' }, { value: 22, label: '22' }, { value: 23, label: '23' },
  ];

  minutes = ['00', '15', '30', '45'];
  meetingNotesValidators = [Validators.maxLength(1000)];
  attendanceValidators = [];
  otherAppointmentNameValidators = [Validators.maxLength(150)];
  pastAppointment = false;
  isFutureAppointment = true;
  errors: ErrorMessage[] = [];
  endTimeValidators = [];
  isValidate = false;
  cohortList: any;
  orgProjectPattern = /^[a-zA-Z0-9-'/!,.()\s]+$/;
  interName: any;
  organizationList: any[];
  showOrganisation = false;
  interventionList: any;
  intName: any;
  isOther: boolean = false;
  
  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<AddOrEditAppointmentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private readonly trackTabService: TrackTabService,
    private readonly manageUsersService: ManageUsersService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getCohortRefData()
    this.initForm();
    this.initConditionalFormValidators();
    
    this.data.interventions.forEach(e => {
      e.name = e?.name?.charAt(0).toUpperCase() + e?.name?.slice(1);
    });

    if (this.data.appointmentId) {
      this.trackTabService.getSingleAppointmentData(this.data.appointmentId).subscribe(appointmentData => {
        if (appointmentData.organizationId) {
          this.trackTabService.getRefIntOrganizationList(appointmentData.interventionId).subscribe(data => {
            this.organizationList = data;
            this.resolveAppointmentData(appointmentData)
          })
        }
        this.resolveAppointmentData(appointmentData)
      });
    }
    this.getFilterUserList();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  getCohortRefData() {
    this.manageUsersService.getCohortRefData().subscribe(resp => {
      this.cohortList = resp;
    })
  }

  getInterventionRefData() {
    this.trackTabService.getInterventionData().subscribe(data => {
      this.interventionList = data;
    })
  }

  initForm() {
    this.addOrUpdateAppointmentForm = this.fb.group({
      appointmentType: [null, [Validators.required]],
      worker: [null, [Validators.required]],
      organizationId: [null],
      otherOrganization: [null, [Validators.maxLength(50), Validators.pattern(this.orgProjectPattern)]],
      date: [null, [Validators.required]],
      timeHours: [null, [Validators.required]],
      timeMinutes: [null, [Validators.required]],
      endTimeHours: [null],
      endTimeMinutes: [null],
      interventionLink: [null],
      meetingNotes: [null, this.meetingNotesValidators],
      attendance: [null, this.attendanceValidators],
      otherAppointmentName: [null, this.otherAppointmentNameValidators],
      activityId: [this.data.activityId]
    });
  }

  isOtherIntervention(value) {
    if(this.addOrUpdateAppointmentForm.get('otherAppointmentName'))
     {
      this.addOrUpdateAppointmentForm.get('otherAppointmentName').reset();
      this.addOrUpdateAppointmentForm.get('otherAppointmentName').clearValidators();
      this.addOrUpdateAppointmentForm.get('otherAppointmentName').updateValueAndValidity();
     }
    if(value.identifier.includes('OTH')) {
     this.addOrUpdateAppointmentForm.get('otherAppointmentName').setValidators([Validators.required,Validators.maxLength(150)])
     this.isOther = true;
    }
    else {
     this.isOther = false;
    }
   }

  resolveAppointmentData(appointmentData: any) {
    
    const appointmentTypeIndex = this.data.appointmentList.findIndex(appointment => appointment.id === appointmentData.appointmentId)
    this.addOrUpdateAppointmentForm.controls.appointmentType.setValue(this.data.appointmentList[appointmentTypeIndex]);

    const workerIndex = this.data.workers.findIndex(worker => worker.id === appointmentData.staffId)
    this.addOrUpdateAppointmentForm.controls.worker.setValue(this.data.workers[workerIndex]);

    this.addOrUpdateAppointmentForm.controls.date.setValue(moment(appointmentData.mdate));

    const meetingTimeSplitArr = appointmentData.mtime.split(':');

    const hoursArrIndexOfAppointment = this.hours.findIndex(hour => hour.label === meetingTimeSplitArr[0])
    this.addOrUpdateAppointmentForm.controls.timeHours.patchValue(this.hours[hoursArrIndexOfAppointment].value);
    if (appointmentData.interventionId) {
      this.showOrganisation = true
      this.organizationList = this.data.organizationList
      const interventionIndex = this.data.interventions.findIndex(intervention => intervention.id === appointmentData.interventionId)
      this.addOrUpdateAppointmentForm.controls.interventionLink.setValue(this.data.interventions[interventionIndex]);
    }

    if (appointmentData.organizationId) {
      const orgObj = this.organizationList.find(organization => organization.id === appointmentData.organizationId)
      this.addOrUpdateAppointmentForm.controls.organizationId.patchValue(orgObj.id);
    }

    const minutesArrIndexOfAppointment = this.minutes.findIndex(minute => minute === meetingTimeSplitArr[1])
    this.addOrUpdateAppointmentForm.controls.timeMinutes.patchValue(this.minutes[minutesArrIndexOfAppointment]);
    if (appointmentData.meetingEndtime) {
      const meetingEndTimeSplitArr = appointmentData.meetingEndtime.split(':');
      const _hoursArrIndexOfAppointment = this.hours.findIndex(hour => hour.label === meetingEndTimeSplitArr[0])
      
      this.addOrUpdateAppointmentForm.controls.endTimeHours.patchValue(this.hours[_hoursArrIndexOfAppointment].value);
      const _minutesArrIndexOfAppointment = this.minutes.findIndex(minute => minute === meetingEndTimeSplitArr[1])
      this.addOrUpdateAppointmentForm.controls.endTimeMinutes.patchValue(this.minutes[_minutesArrIndexOfAppointment]);
    }
   
    if (appointmentData.notes) {
      this.addOrUpdateAppointmentForm.controls.meetingNotes.setValue(appointmentData.notes);
    }

    if (appointmentData.statusId) {
      const statusIndex = this.data.statusList.findIndex(status => status.id === appointmentData.statusId)
      this.addOrUpdateAppointmentForm.controls.attendance.setValue(this.data.statusList[statusIndex]);
    }

    if (appointmentData.other && this.data.appointmentList[appointmentTypeIndex].identifier.includes('OTH')) {
      this.isOther = true
      this.addOrUpdateAppointmentForm.get('otherAppointmentName').setValidators([Validators.required,Validators.maxLength(150)])
      this.addOrUpdateAppointmentForm.controls.otherAppointmentName.setValue(appointmentData.other);
    }
  }

  initConditionalFormValidators() {
    this.addOrUpdateAppointmentForm.get('appointmentType').valueChanges.subscribe(value => {
      if (value.identifier.includes('OTH')) {
        this.addOrUpdateAppointmentForm.controls.otherAppointmentName.setValidators(this.otherAppointmentNameValidators.concat(Validators.required))
      }
    })
    this.addOrUpdateAppointmentForm.get('date').valueChanges.subscribe(value => {
      this.checkAppointment();
      let isCurrentDate 
    if(this.addOrUpdateAppointmentForm.controls.date?.value){
       isCurrentDate = this.addOrUpdateAppointmentForm.controls.date?.value?.isSame(new Date(), "day");
    }
      if (this.isPastDate()) {
        this.disabledMeetingEndTime(false);
      } else if (isCurrentDate) {
        this.disabledMeetingEndTime(false);
      } else {
        this.disabledMeetingEndTime(true);
      }
    })
    this.addOrUpdateAppointmentForm.get('timeHours').valueChanges.subscribe(value => {
      this.checkAppointment();
      this.validateMeetingStartAndEndTime();
      if (this.isValidate) {
        this.addOrUpdateAppointmentForm.get('endTimeHours').setValue(this.addOrUpdateAppointmentForm.get('endTimeHours').value);
        this.addOrUpdateAppointmentForm.get('endTimeMinutes').setValue(this.addOrUpdateAppointmentForm.get('endTimeMinutes').value);
      }

    })
    this.addOrUpdateAppointmentForm.get('timeMinutes').valueChanges.subscribe(value => {
      this.checkAppointment();
      this.validateMeetingStartAndEndTime();
    })
    this.addOrUpdateAppointmentForm.get('endTimeHours').valueChanges.subscribe(value => {
      this.validateMeetingStartAndEndTime();
    })
    this.addOrUpdateAppointmentForm.get('endTimeMinutes').valueChanges.subscribe(value => {
      this.validateMeetingStartAndEndTime();
    })
  };

  checkAppointment() {
    if (this.isAppointmentInPast()) {
      this.addOrUpdateAppointmentForm.controls.meetingNotes.setValidators(this.meetingNotesValidators.concat(Validators.required));
      this.addOrUpdateAppointmentForm.controls.attendance.setValidators(this.attendanceValidators.concat(Validators.required));
    }
    else {
      this.resetMeetingNotesValidation();
      this.resetAttendanceValidation();
    }
  }

  resetMeetingNotesValidation() {
    this.meetingNotesValidators = [Validators.maxLength(1000)]
    this.addOrUpdateAppointmentForm.controls.meetingNotes.clearValidators()
    this.addOrUpdateAppointmentForm.controls.meetingNotes.setValidators(this.meetingNotesValidators)
    this.addOrUpdateAppointmentForm.controls.meetingNotes.setValue(null)
    this.addOrUpdateAppointmentForm.controls.meetingNotes.setErrors(null);
    this.addOrUpdateAppointmentForm.controls.meetingNotes.markAsPristine();
    this.addOrUpdateAppointmentForm.updateValueAndValidity();
  }

  resetAttendanceValidation() {
    this.attendanceValidators = [Validators.maxLength(150)]
    this.addOrUpdateAppointmentForm.controls.attendance.clearValidators()
    this.addOrUpdateAppointmentForm.controls.attendance.setValidators(this.attendanceValidators)
    this.addOrUpdateAppointmentForm.controls.attendance.setValue(null)
    this.addOrUpdateAppointmentForm.controls.attendance.setErrors(null);
    this.addOrUpdateAppointmentForm.controls.attendance.markAsPristine();
    this.addOrUpdateAppointmentForm.updateValueAndValidity();
  }

  confirmAddAppointment() {

    const appointmentData = {
      formValues: this.addOrUpdateAppointmentForm.value,
      isAppointmentInPast: this.isAppointmentInPast(),
    }
    if (this.validateMeetingStartAndEndTime() && this.addOrUpdateAppointmentForm.valid) {
      this.dialogRef.close(appointmentData);
    }
  }

  cancelAddAppointment() {
    this.dialogRef.close();
  }

  isPastDate() {
    if (this.addOrUpdateAppointmentForm.controls.date.value && this.addOrUpdateAppointmentForm.controls.date.value.isBefore(new Date(), "day")) {
      return true;
    }
    return false;
  }

  isAppointmentInPast() {
    if (
      this.addOrUpdateAppointmentForm.controls.date.value &&
      (this.addOrUpdateAppointmentForm.controls.timeHours.value || this.addOrUpdateAppointmentForm.controls.timeHours.value === 0) &&
      (this.addOrUpdateAppointmentForm.controls.timeMinutes.value || this.addOrUpdateAppointmentForm.controls.timeMinutes.value === '00')
    ) {
      const isCurrentDate = this.addOrUpdateAppointmentForm.controls.date.value.isSame(new Date(), "day");
      if (isCurrentDate && this.addOrUpdateAppointmentForm.controls.timeHours.value
        && this.addOrUpdateAppointmentForm.controls.timeMinutes.value) {
        const result = this.setIsPastAppointment();
        if (!result) {
          this.isStartAndEndTimeSelected();
        } else {
          this.disabledMeetingEndTime(false);
        }
        return result;
      } else if (this.addOrUpdateAppointmentForm.controls.date.value < this.currentDate) {
        return true
      } else {
        this.isStartAndEndTimeSelected();
        return false
      }
    } else {
      this.isStartAndEndTimeSelected();
      return false
    }
    return false;
  }

  isStartAndEndTimeSelected() {
    if (this.addOrUpdateAppointmentForm.controls.timeHours.value !== null &&
      this.addOrUpdateAppointmentForm.controls.timeMinutes.value !== null) {
      this.disabledMeetingEndTime(true);
    }
  }



  setIsPastAppointment() {

    const appointmentYear = this.addOrUpdateAppointmentForm.controls.date.value._i.year || moment(this.addOrUpdateAppointmentForm.controls.date.value).year()
    const appointmentMonth = this.addOrUpdateAppointmentForm.controls.date.value._i.month || moment(this.addOrUpdateAppointmentForm.controls.date.value).month()
    const appointmentDay = this.addOrUpdateAppointmentForm.controls.date.value._i.date || moment(this.addOrUpdateAppointmentForm.controls.date.value).date()
    const appointmentHours = this.addOrUpdateAppointmentForm.controls.timeHours.value === 0 ? '00' : this.addOrUpdateAppointmentForm.controls.timeHours.value
    const appointmentMinutes = this.addOrUpdateAppointmentForm.controls.timeMinutes.value
    const appointmentDateAndTime = moment(`${appointmentYear}-${appointmentMonth + 1}-${appointmentDay} ${appointmentHours}:${appointmentMinutes}`)
    this.pastAppointment = appointmentDateAndTime.isBefore()
    if (this.pastAppointment) {
      return true
    } else {
      return false
    }
  }


  disabledMeetingEndTime(isDisable) {

    if (isDisable) {
      this.addOrUpdateAppointmentForm.controls['endTimeHours'].disable()
      this.addOrUpdateAppointmentForm.controls['endTimeHours'].setValue(null);
      this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].disable()
      this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].setValue(null);
      this.addOrUpdateAppointmentForm.controls.endTimeHours.clearValidators();
      this.addOrUpdateAppointmentForm.controls.endTimeMinutes.clearValidators();

      this.addOrUpdateAppointmentForm.controls.attendance.markAsPristine();
      this.addOrUpdateAppointmentForm.updateValueAndValidity();
    } else {
      this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].enable();
      this.addOrUpdateAppointmentForm.controls['endTimeHours'].enable();
      this.addOrUpdateAppointmentForm.controls['endTimeHours'];
      this.addOrUpdateAppointmentForm.controls['endTimeMinutes'];
      this.addOrUpdateAppointmentForm.controls['endTimeHours'].updateValueAndValidity();
      this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].updateValueAndValidity();
    }

  }

  validateMeetingStartAndEndTime() {
    
    this.clearError();
    const mEndHrs = this.addOrUpdateAppointmentForm.controls.endTimeHours.value;
    const mEndMin = this.addOrUpdateAppointmentForm.controls.endTimeMinutes.value;
    let isCurrentDate 
    if(this.addOrUpdateAppointmentForm.controls.date?.value){
       isCurrentDate = this.addOrUpdateAppointmentForm.controls.date?.value?.isSame(new Date(), "day");
    }
    if (this.isPastDate() || isCurrentDate) {
      this.clearError();
      const year = moment(this.addOrUpdateAppointmentForm.controls.date.value).year();
      const month = moment(this.addOrUpdateAppointmentForm.controls.date.value).month();
      const day = moment(this.addOrUpdateAppointmentForm.controls.date.value).date();

      const mStartHrs = this.addOrUpdateAppointmentForm.controls.timeHours.value;
      const mStartMin = this.addOrUpdateAppointmentForm.controls.timeMinutes.value;

      const mStartTime = moment(`${year}-${month + 1}-${day} ${mStartHrs}:${mStartMin}:${'00'}`);
      const mEndTime = moment(`${year}-${month + 1}-${day} ${mEndHrs}:${mEndMin}:${'00'}`);

      if (mStartTime.isSame(mEndTime) && mStartTime !== null && mEndTime !== null) {
        const error = { id: 'InvalidTime', message: 'Meeting start time and end time cannot be same' }
        this.errors.push(error);
        this.addOrUpdateAppointmentForm.controls['endTimeHours'].setErrors({ 'incorrect': true });
        this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].setErrors({ 'incorrect': true });
        this.addOrUpdateAppointmentForm.markAsTouched();
        this.isValidate = false;
        return false;
      }
      else if (mEndTime.isBefore(mStartTime) && mStartTime !== null && mEndTime !== null) {
        this.addOrUpdateAppointmentForm.controls['endTimeHours'].setErrors({ 'incorrect': true });
        this.addOrUpdateAppointmentForm.controls['endTimeHours'].markAsTouched();
        this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].setErrors({ 'incorrect': true });
        this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].markAsTouched();

        const error = { id: 'InvalidMettingTime', message: 'Meeting end time cannot be before start time' }
        this.errors.push(error);
        this.isValidate = false;
        return false;
      }
      else if (mEndHrs !== null && mEndMin !== null && isCurrentDate) {
        const appointmentEndDateAndTime = moment(`${year}-${month + 1}-${day} ${mEndHrs}:${mEndMin}`)
        if (appointmentEndDateAndTime.isAfter()) {
          this.addOrUpdateAppointmentForm.controls['endTimeHours'].setErrors({ 'incorrect': true });
          this.addOrUpdateAppointmentForm.controls['endTimeHours'].markAsTouched();
          this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].setErrors({ 'incorrect': true });
          this.addOrUpdateAppointmentForm.controls['endTimeMinutes'].markAsTouched();
          const error = { id: 'InvalidTime', message: 'The end time cannot be in the future' }
          this.errors.push(error);
          this.isValidate = false;
          return false;
        }
      }
    }
    this.isValidate = true;
    return true;
  }

  public getErrors(): ErrorMessage[] {
    return this.errors;
  }
  public clearError() {
    this.errors = [];
  }

  change(event) {
    this.showOrganisation = true
    if (event.value) {
      this.interName = event.value;
      this.addOrUpdateAppointmentForm.controls.organizationId.reset();
      this.getInterventionId(this.interName.id);
    }
  }

  getInterventionId(id) {
    this.getOrganizationList(id);
  }

  getOrganizationList(interventionId) {
    // this.trackTabService.getRefIntOrganizationList(interventionId).subscribe(data => {
    //   this.organizationList = data;
    // })
    this.organizationList = this.data.organizationList
  }

  setOrganizationValidators() {
    const interventionControl = this.addOrUpdateAppointmentForm.get('interventionLink');
    this.addOrUpdateAppointmentForm.get('interventionLink').valueChanges.subscribe(value => {
      if (value) {
        interventionControl.setValidators([Validators.required]);
        interventionControl.updateValueAndValidity();
        interventionControl.markAsTouched();
      } else {
        interventionControl.clearValidators();
        interventionControl.updateValueAndValidity();
      }
    });
  }

  getFilterUserList() {
    this.manageUsersService.getFilterUserList(2).subscribe(userData=>{
      userData.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.data.workers = userData;
    })
  }

}
