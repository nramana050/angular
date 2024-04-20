import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { AppConfirmService } from '../../../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { Utility } from '../../../../framework/utils/utility';
import { LearnersService } from '../../learners.services';

@Component({
  selector: 'app-edit-enrolment',
  templateUrl: './edit-enrolment.component.html',
  styleUrls: ['./edit-enrolment.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class EditEnrolmentComponent implements OnInit, AfterViewChecked {

  fullName: any;
  enrolmentForm: FormGroup;
  refData: any;
  enroledCourses: any[] = [];
  courses: any[] = [];
  coursesColumns: string[] = ['courseName', 'qualificationName', 'startDate', 'endDate', 'isCourseCompleted']
  isOccurred;
  noAnswers: number[] = [];
  isOninit = false;
  refAnswer: any;
  cohort: any;
  pName: any;
  isNotWithdrawn: Boolean = true;
  currentDate = new Date();
  deliveryEndDate;
  presentdate;
  deliveryStartDate;
  attemptDate;
  programmeStatus: any;
  programmeStatusValue: any;
  lastAttendanceDate;
  id: any;
  did: any;
  namePattern = RegexPattern.allCharPattern;
  courseIndex: number;
  attempt2: boolean;
  attempt3: boolean;
  isAttempted: number = 0;
  isDisabled = true;
  isDisabledArray: any[] = [];
  disableSave = false;


  constructor(
    private readonly learnersService: LearnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly formBuilder: FormBuilder,
    private readonly appConfirmService: AppConfirmService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.isOninit = true;
    this.initForm();
    this.route.queryParams.subscribe((params: any) => {
      this.enrolmentForm.controls.learnerId.patchValue(params.id)
      this.enrolmentForm.controls.programmeDeliveryId.patchValue(params.did)
      this.enrolmentForm.controls.programmeName.patchValue(params.pName)
      
      this.id = params.id;
      this.fullName = params.name;
      this.did = params.did;
      this.pName = params.pName;
      this.setProgrammeStatus(params.status)
      this.learnersService.getLearnerEnrolmentDetails(this.id, this.did).subscribe(enrolmentDetails => {
        this.enrolmentForm.controls.cohort.patchValue(enrolmentDetails.programmeDeliverySeq)
        if(enrolmentDetails.programStatus === 6 || enrolmentDetails.programStatus === 1) {
          this.disableSave = true;
        }
        this.enrolmentForm.controls.programmeId.patchValue(enrolmentDetails.programmeId)
        this.enrolmentForm.controls.actualEndDate.patchValue(enrolmentDetails.actualEndDate)
        this.enrolmentForm.controls.withdrawalReasonId.patchValue(enrolmentDetails.withdrawalReasonId)
        this.enroledCourses = enrolmentDetails.withdrawLearnerCourseDetails;
        this.enroledCourses.forEach((element, index) => {
          if (!element.isCourseCompleted) {
            element.isCourseCompleted = false;
          }
          const control = this.formBuilder.group({
            courseId: [element.courseId],
            courseName: [element.courseName],
            isCourseCompleted: [element.isCourseCompleted],
            qualificationOutcomeDtos: new FormArray([]),
            startDate: [element.startDate],
            endDate: [element.endDate],
            qualificationId: [element.qualificationId],
            qualificationName: [element.qualificationName],
            programCourseDeliveryId: [element.programCourseDeliveryId],
            isAttempted: [null],
            isInProgress: [null],
          })
          this.withdrawLearnerCourseDetailsForm.push(control);
          this.onactualDateChange();
          this.isCourseCompletedChange(element, index);
        })
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
    this.learnersService.getRefData().subscribe(data => {
      this.refData = data;
    })
    if(this.enrolmentForm.get('programStatus').value==4){
      this.enrolmentForm.get('withdrawalReasonId').setValidators(null)
    }
  }

  initForm() {
    
    this.enrolmentForm = this.formBuilder.group({
      programmeName: [{ value: this.pName, disabled: true }],
      programmeId: [],
      programmeDeliveryId: [null],
      learnerId: [null],
      cohort: [{ value: this.cohort, disabled: true }],
      actualEndDate: [null, [Validators.required]],
      withdrawalReasonId:[null, [Validators.required]],
      programStatus: [],
      withdrawLearnerCourseDetails: new FormArray([]),
    });
  }

  getLastAttendanceDate() {
    this.learnersService.getLastAttendedDate(this.did, this.id).subscribe(data => {
      if (data) {
        this.deliveryStartDate = data;
        this.lastAttendanceDate = data;
      }
      else {this.deliveryStartDate = this.withdrawLearnerCourseDetailsForm.at(0).get('startDate').value;;
        this.lastAttendanceDate = this.withdrawLearnerCourseDetailsForm.at(0).get('startDate').value;
      }
    }, error => {
      this.snackBarService.error(error.error.applicationMessage);
    })
  }

  setProgrammeStatus(status) {
    this.programmeStatus = status;
    if (this.programmeStatus === '2') {
      this.programmeStatus = 'Withdrawn'
    }
    if (this.programmeStatus === '1') {
      this.programmeStatus = 'In progress'
      this.programmeStatusValue = 1;
    }
    else {
      this.programmeStatusValue = 1;
    }
    if (this.programmeStatus === '6') {
      this.programmeStatus = 'Finished - Not Completed'
      this.programmeStatusValue = 6;
    }
    if (this.programmeStatus === 'Completed') {
      this.programmeStatusValue = 4;
    }
    if (this.programmeStatus === '4') {
      this.programmeStatus = 'Completed'
      this.programmeStatusValue = 4;
    }
    this.enrolmentForm.get('programStatus').patchValue(this.programmeStatusValue);

    if (this.programmeStatus === 'Withdrawn') {
      this.enrolmentForm.get('programStatus').disable();
      this.enrolmentForm.get('programStatus').setValue(2);
      this.enrolmentForm.get('actualEndDate').disable();
      this.enrolmentForm.get('withdrawalReasonId').disable();
    }
    if(this.programmeStatus === 'Not Yet Started'){
      this.enrolmentForm.get('programStatus').disable();
    }
    if (this.programmeStatus === 'Completed') {
      this.enrolmentForm.get('programStatus').disable();
      this.enrolmentForm.get('programStatus').setValue(4);
      this.enrolmentForm.get('actualEndDate').disable();
    }
  }

  onStatusChange(event) {
    if (event.value === 2 || event.value === 4) {
      this.getLastAttendanceDate();
      this.disableSave = false;
      this.deliveryEndDate = this.withdrawLearnerCourseDetailsForm.at(this.withdrawLearnerCourseDetailsForm.length - 1).get('endDate').value;
    }
    if (event.value !== 2 || event.value !== 4) {
      this.enrolmentForm.get('actualEndDate').reset();
      this.enrolmentForm.get('withdrawalReasonId').reset();
    }
  }

  get withdrawLearnerCourseDetailsForm() {
    return this.enrolmentForm.get('withdrawLearnerCourseDetails') as FormArray;
  }

  navigateToWorkshopAttendance() {
    this.route.queryParams.subscribe((params: any) => {
      this.router.navigate(['/learners/enrolment-details'], { queryParamsHandling: 'merge', queryParams: { id: params.id, name: params.name } });
    });
  }

  onSubmit() {
    let payload = this.enrolmentForm.getRawValue();
    this.formatDates(payload);
    if (!(this.programmeStatus === 'Withdrawn') && this.programmeStatus !== 'Finished - Not Completed' && this.programmeStatus !== 'Completed') {
      const dialogRef = this.appConfirmService.confirm({
        title: `Learner withdrawn`,
        message: `Once a Learner has been Withdrawn from a Programme, this cannot be un-done. Are you sure you want to Withdraw this Learner from the Programme?`,
        okButtonLabel: 'Yes - Continue'
      });
      this.saveEnrolmentForProgrammeStatus(dialogRef,payload);
    }
    if (this.programmeStatus === 'Finished - Not Completed') {
      const dialogRef = this.appConfirmService.confirm({
        title: `Learner completed`,
        message: `Once the programme has been marked as completed, you will no longer be able to change the status or actual end date. Are you sure you want to mark this learner as having completed the Programme?`,
        okButtonLabel: 'Yes - Continue'
      });
      this.saveEnrolmentForProgrammeStatus(dialogRef,payload);
    }
    if (this.programmeStatus === 'Withdrawn' || this.programmeStatus === 'Completed') {
      this.updateEnrolment(payload);
    }
  }

  formatDates(payload: any) {
    payload.actualEndDate = Utility.transformDateToString(payload.actualEndDate)
    payload.withdrawLearnerCourseDetails.forEach(record => {
      record.qualificationOutcomeDtos.forEach(data => {
        data.attemptDate = Utility.transformDateToString(data.attemptDate);
        data.qualificationExpiryDate = Utility.transformDateToString(data.qualificationExpiryDate);
      });
    });
  }

  saveEnrolmentForProgrammeStatus(dialogRef,payload){
    dialogRef.subscribe(result => {
      if (result) {
        this.saveEnrolment(payload);
      }
    })
  }

  saveEnrolment(payload) {
    this.learnersService.saveEnrolment(payload).subscribe(rsp => {
      this.router.navigate(['learners/enrolment-details'], { queryParamsHandling: 'merge'});
      if(payload.programStatus === 2){
        this.snackBarService.success("Learner withdrawn successfully");
      }
      else if(payload.programStatus === 4) {
        this.snackBarService.success("Learner program status has been changed to completed");
      }
    },
      error => this.snackBarService.error(error.error.applicationMessage)
    )
  }

  updateEnrolment(payload) {
    payload.withdrawLearnerCourseDetails.forEach((element) => {
      if (element.qualificationReferenceNumber==="") {
        element.qualificationReferenceNumber=null;
      }
    })
    this.learnersService.updateEnrolment(payload).subscribe(rsp => {
      this.router.navigate(['learners/enrolment-details'], { queryParamsHandling: 'merge', queryParams: { id: payload.learnerId, name: this.fullName, did: payload.programmeDeliveryId } });
      this.snackBarService.success(rsp.message.applicationMessage);
    },
      error => this.snackBarService.error(error.error.applicationMessage)
    )
  }

  resetDate() {
    if ((this.enrolmentForm.get('programStatus')?.value === 1)) {
      this.enrolmentForm.get('actualEndDate').reset();
    }

  }

  onactualDateChange() {
    this.withdrawLearnerCourseDetailsForm.controls.forEach(element => {
      const actualEndDate = Utility.transformDateToString(this.enrolmentForm.get('actualEndDate').value);
      if (actualEndDate < element.get('startDate').value) {
        element.get('isInProgress').patchValue(true);
      }
      else {
        element.get('isInProgress').patchValue(false);
      }
    });
  }

  isCourseCompletedChange(element, index) {
    let innerArray = []
    this.courseIndex = index;
    const currentFormGroup = this.withdrawLearnerCourseDetailsForm.at(index) as FormGroup;
    const isAttended = currentFormGroup.get('isCourseCompleted').value;
    if (isAttended && this.enroledCourses[index].qualificationId != null) {
      this.noAnswers.push(currentFormGroup.get('courseId').value);
      if (element.qualificationOutcomeDtos.length === 0) {
        const control = this.formBuilder.group({
          outcomeId: [null],
          attemptDate: [null],
          qualificationExpiryDate: [null],
          qualificationReferenceNumber: [null, [Validators.maxLength(20), Validators.pattern(this.namePattern)]]
        })
        this.qualificationOutcomeDtosForm.push(control);

      }
      else {
        element.qualificationOutcomeDtos.forEach((attempt, i) => {
          const control = this.formBuilder.group({
            outcomeId: [attempt.outcomeId],
            attemptDate: [attempt.attemptDate],
            qualificationExpiryDate: [attempt.qualificationExpiryDate],
            qualificationReferenceNumber: [attempt.qualificationReferenceNumber, [Validators.maxLength(20), Validators.pattern(this.namePattern)]]
          })
          this.qualificationOutcomeDtosForm.push(control);
          if (attempt.outcomeId !== 1) {
            innerArray.push(false)
          }
          else {
            innerArray.push(true)
          }
        })
      }

    } else {
      this.qualificationOutcomeDtosForm.clear();
      if (this.noAnswers.includes(currentFormGroup.get('courseId').value)) {
        this.noAnswers.splice(this.noAnswers.indexOf(currentFormGroup.get('courseId').value));
      }
    }
    this.isDisabledArray.push(innerArray);
    this.attemptPassed(currentFormGroup);
    this.deliveryStartDate = this.withdrawLearnerCourseDetailsForm.at(0).get('startDate').value;
    this.deliveryEndDate = this.withdrawLearnerCourseDetailsForm.at(this.withdrawLearnerCourseDetailsForm.length - 1).get('endDate').value;
  }

  attemptPassed(currentFormGroup) {
    this.isAttempted = 0;
    currentFormGroup.get('qualificationOutcomeDtos').value.forEach(attempt => {
      if (attempt.outcomeId === 1) {
        this.isAttempted = attempt.outcomeId;
      }
      else {
        if (this.isAttempted !== 1) {
          this.isAttempted = 0;
        }
      }
    })
    currentFormGroup.get('isAttempted').patchValue(this.isAttempted);
  }

  isQualificationOutcome(cIndex, qIndex, element) {
    this.courseIndex = cIndex;
    const currentFormGroup = this.withdrawLearnerCourseDetailsForm.at(cIndex) as FormGroup;
    this.attemptPassed(currentFormGroup);
    if (element !== 1) {
      this.isDisabled = false;
      this.isDisabledArray[cIndex][qIndex] = false;
      this.noAnswers.splice(this.noAnswers.indexOf(currentFormGroup.get('courseId').value, 1));
    }
    else {
      this.isDisabled = true;
      this.isDisabledArray[cIndex][qIndex] = true;
      this.isQualificationOutcomePassed(currentFormGroup, qIndex)
    }
  }

  isQualificationOutcomePassed(currentFormGroup, qIndex) {
    const qualificationArray = currentFormGroup.get('qualificationOutcomeDtos') as FormArray
    if (qIndex === qualificationArray.length - 1) {
      this.deliveryStartDate = this.withdrawLearnerCourseDetailsForm.at(0).get('startDate').value;
      qualificationArray.at(qIndex).get('outcomeId').setErrors(null)
      this.deliveryEndDate = this.withdrawLearnerCourseDetailsForm.at(this.withdrawLearnerCourseDetailsForm.length - 1).get('endDate').value;
      this.noAnswers.push(currentFormGroup.get('courseId').value);
    }
    else {
      for (let i = 0; i < qualificationArray.length - 1; i++) {
        if (qualificationArray.at(i).get('outcomeId').value === 1) {
          qualificationArray.at(i).get('outcomeId').setErrors({ incorrect: true })
        }
      }
          this.deliveryStartDate = this.withdrawLearnerCourseDetailsForm.at(0).get('startDate').value;
          this.deliveryEndDate = this.withdrawLearnerCourseDetailsForm.at(this.withdrawLearnerCourseDetailsForm.length - 1).get('endDate').value;
    }
  }

  onRefId(event, index) {
    console.log("in keyup ", event.target.value);
    if (event.target.value.length > 20) {
      this.withdrawLearnerCourseDetailsForm.at(index).get('qualificationReferenceNumber').setErrors({ incorrect: true })
    }
  }

  addControlInFormGroup(field, formGroup, formControl: FormControl) {
    formGroup.addControl(field, formControl);
    formGroup.addControl(field, formControl);
    formGroup.updateValueAndValidity();
  }

  onattemptDateChange(event, cIndex, qIndex) {
    const qualificationArray = this.withdrawLearnerCourseDetailsForm.at(cIndex).get('qualificationOutcomeDtos') as FormArray
    qualificationArray.at(qIndex).get('qualificationExpiryDate').reset();
  }

  removeControlInFormGroup(field, formGroup) {
    formGroup.removeControl(field);
    formGroup.updateValueAndValidity();
  }

  addAttempt(cIndex, qIndex) {
    this.courseIndex = cIndex
    if (this.qualificationOutcomeDtosForm.controls.length > 0) {
      const control = this.formBuilder.group({
        outcomeId: [null],
        attemptDate: [null],
        qualificationExpiryDate: [null],
        qualificationReferenceNumber: [null, [Validators.maxLength(20), Validators.pattern(this.namePattern)]]
      })
      this.qualificationOutcomeDtosForm.push(control)
    }
  }

  onDelete(cIndex, qIndex) {
    this.courseIndex = cIndex
    const currentFormGroup = this.withdrawLearnerCourseDetailsForm.at(cIndex).get('qualificationOutcomeDtos') as FormArray;
    if (qIndex > 0) {
      if (currentFormGroup.at(qIndex - 1).get('outcomeId').value !== 1) {
        this.isDisabled = false;
      }
      else {
        this.isDisabled = true;
      }
    }
    this.qualificationOutcomeDtosForm.removeAt(qIndex);
    this.isQualificationOutcomePassed(this.withdrawLearnerCourseDetailsForm.at(cIndex) as FormGroup, qIndex - 1)
    this.isPlusButtonEnabled(this.withdrawLearnerCourseDetailsForm.at(cIndex) as FormGroup,cIndex,qIndex)
  }

  isPlusButtonEnabled(form,cIndex,qIndex){
    if(qIndex-1<0){
      this.isDisabledArray[cIndex][qIndex] = true;
    }
    else{
      this.isDisabledArray[cIndex][qIndex] = false;
    }
  }

  get qualificationOutcomeDtosForm() {
    return this.withdrawLearnerCourseDetailsForm.at(this.courseIndex).get('qualificationOutcomeDtos') as FormArray;
  }
}
