import { trigger, state, style, transition, animate } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CourseSetupService } from 'src/app/features/admin/course-setup/course-setup.service';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProgrammesService } from '../../programmes/programmes.service';
import { ProgrammeDeliveryNavigation } from '../programme-delivery-nav';
import { ProgrammeDeliveryService } from '../programme-delivery.service';
import { log } from 'console';

@Component({
  selector: 'app-progress-completion',
  templateUrl: './progress-completion.component.html',
  styleUrls: ['./progress-completion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ProgressCompletionComponent implements OnInit, AfterViewChecked, OnDestroy {

  completionForm: FormGroup;
  coursesColumns: string[] = ['courseName', 'isCourseCompleted'];
  progressAndCompletionData;
  progressAndCompletionLearners: any[] = [];
  noAnswers: number[] = [];
  allListOfCourse: any[] = [];
  courseIds: any;
  learnerIds: any;
  learnersColumn = ['learnerName', 'isCompleted']
  allLearners: any = [];
  learnerIndex: number;
  learnerDataSourse = new MatTableDataSource;
  deliveryId: number;
  currentDate: string;
  getLearnerIds: any = [];
  programmeCompletionStatus: any;
  programmeActualEndDate: any;
  isDisabled = false;
  isCourseDisabledArray: any[] = [];
  isHidden = false;
  manageUserService: ManageUsersService;
  programmeDeliveryService: ProgrammeDeliveryService;
  courseService: CourseSetupService;
  snackBarService: SnackBarService;
  inPageNavService: InPageNavService;
  appConfirmService: AppConfirmService;
  programmeName: any;
  programmesService: ProgrammesService;
  programmeCourse: any;
  deliveryStartDate: any;
  deliveryEndDate: any;

  enroledCourses: any;
  courseIndex: number;
  learnersService: LearnersService
  courseQualificationIds: any[] = [];
  programmeCoursesQualification: any[] = [];
  refData: any;
  isAttempted: number;
  namePattern = RegexPattern.allCharPattern;
  isLearnerAttendedArray: any[] = [];

  showQualificationOutcomeDtosFormArray = false;
  ShowTableCell = false;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly programmeDeliveryNavigation: ProgrammeDeliveryNavigation,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly injector: Injector,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
  ) {
    this.manageUserService = this.injector.get(ManageUsersService);
    this.programmeDeliveryService = this.injector.get(ProgrammeDeliveryService);
    this.courseService = this.injector.get(CourseSetupService);
    this.snackBarService = this.injector.get(SnackBarService);
    this.inPageNavService = this.injector.get(InPageNavService);
    this.appConfirmService = this.injector.get(AppConfirmService);
    this.programmesService = this.injector.get(ProgrammesService);
    this.learnersService = this.injector.get(LearnersService)
    this.currentDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    this.inPageNavService.setNavItems(this.programmeDeliveryNavigation.programmeDeliverySubMenu);
    this.initForm();
  }

  ngOnInit() {
    this.resolveProgressAndComplition();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initForm() {
    this.completionForm = this.formBuilder.group({
      programmeDeliveryId: [this.deliveryId],
      courseCompletionDetails: new FormArray([]),
      programmeCompletionDetails: this.getProgrammeCompletionDetails(),
    });
  }

  /* get all data from back-end */
  resolveProgressAndComplition() {

    this.route.queryParams.subscribe((params: any) => {
      this.deliveryId = params.id
      this.programmeName = params.pname
      forkJoin([
        this.courseService.getAllCourses(),
        this.manageUserService.getAllSuUserByLggedInClient(),
        this.programmeDeliveryService.getProgressAndCompletionLearners(params.id),
        this.programmeDeliveryService.getProgressAndCompletionData(params.id),
        this.programmesService.getAllProgrammeCourses(),
        this.learnersService.getRefData()
      ]).subscribe(data => {
        this.allListOfCourse = data[0];
        this.allListOfCourse.forEach(course => {
          course.value = course.courseName;
        })
        this.allLearners = data[1];
        this.allLearners.forEach(learner => {
          learner.value = learner.firstName + ' ' + learner.lastName;
        })

        this.progressAndCompletionData = data[3];
        this.resolveProgressAndCompletionData();

        this.progressAndCompletionLearners = data[2];
        this.progressAndCompletionLearnerData();

        this.refData = data[5];

      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })

    })
  }

  /** It add courses and learners initially */
  resolveProgressAndCompletionData() {
    this.ShowTableCell = false;
    this.programmeCompletionStatus = this.progressAndCompletionData.programmeCompletionDetails.programmeCompletionStatus;
    if (this.programmeCompletionStatus) {
      this.isHidden = true;
    }

    let courseCompletionDetailsForm = this.completionForm.get('courseCompletionDetails') as FormArray;
    this.progressAndCompletionData.courseCompletionDetails.forEach(async (courseElement, courseIndex) => {
      let control = this.formBuilder.group({
        courseId: [courseElement.courseId],
        courseProgrammeMappingId: [courseElement.courseProgrammeMappingId],
        isCourseCompleted: [courseElement.isCourseCompleted],
        learnerCourseDetails: new FormArray([]),
        startDate: [courseElement.startDate],
        endDate: [courseElement.endDate],
        hasQualification: [courseElement.hasQualification],
        qualificationId: [courseElement?.qualificationId]
      });

      courseCompletionDetailsForm.push(control);

      await this.pushLearnerCourseDetails(control, courseElement, courseIndex);
      if (control.get('startDate').value > this.currentDate || this.programmeCompletionStatus) {
        this.isCourseDisabledArray.push("true");
      }
      else {
        this.isCourseDisabledArray.push("false");
      }

      let courseCompletionDetails = this.completionForm.get('courseCompletionDetails') as FormArray;
      if (courseIndex == this.progressAndCompletionData.courseCompletionDetails.length - 1) {
        this.ShowTableCell = true;
      }
    })
    this.deliveryEndDate = courseCompletionDetailsForm.at(courseCompletionDetailsForm.length - 1).get('endDate').value;
    this.deliveryStartDate = courseCompletionDetailsForm.at(0).get('startDate').value;
    if (this.deliveryEndDate > this.currentDate || this.programmeCompletionStatus) {
      this.isDisabled = true;
    }

  }

  pushLearnerCourseDetails(courseControl: AbstractControl, courseElement: Object, courseIndex: number): Promise<AbstractControl> {

    return new Promise(resolve => {
      this.courseIndex = courseIndex;
      const isCourseCompleted = courseControl.get('isCourseCompleted').value;
      if (isCourseCompleted) {

        this.noAnswers.push(courseControl.get('courseId').value);
        let learnerCourseDetailsControlArray = courseControl.get('learnerCourseDetails') as FormArray;
        courseElement['learnerCourseDetails']?.forEach((learner, learnerIndex) => {
          let innerOutcomeArray = [];
          this.learnerIndex = learnerIndex;
          this.courseIndex = courseIndex;
          learnerCourseDetailsControlArray.push(this.formBuilder.group({
            learnerId: [learner.learnerId],
            isCompleted: [learner.isCompleted || false],
            qualificationOutcomeDtos: new FormArray([])
          }));
          let qualificationOutcomeDtosControlArray = learnerCourseDetailsControlArray.at(learnerIndex).get('qualificationOutcomeDtos') as FormArray;
          learner.qualificationOutcomeDtos.forEach(qualificationOutcomeDtosElement => {
            qualificationOutcomeDtosControlArray.push(this.formBuilder.group({
              outcomeId: [qualificationOutcomeDtosElement.outcomeId || null],
              attemptDate: [qualificationOutcomeDtosElement.attemptDate || null],
              qualificationExpiryDate: [qualificationOutcomeDtosElement.qualificationExpiryDate || null],
              qualificationReferenceNumber: [qualificationOutcomeDtosElement.qualificationReferenceNumber || null, [Validators.maxLength(20), Validators.pattern(this.namePattern)]]
            }))
          });
        })
        resolve(learnerCourseDetailsControlArray);
      } else {
        resolve(null);
      }
    })
  }

  /** It add all enrolled learners under the programme completed */
  progressAndCompletionLearnerData() {
    this.learnerIds = []
    if (this.progressAndCompletionData.programmeCompletionDetails.learnerProgrammeDetails.length === 0) {
      this.progressAndCompletionLearners.forEach(learner => {

        if (this.learnerIds.filter(d => d.learnerId === learner.learnerIds).length === 0) {
          this.learnerIds.push({
            'learnerId': learner.learnerIds,
            'isCompleted': []
          });
        }
      })
    }

    else {
      this.progressAndCompletionData.programmeCompletionDetails.
        learnerProgrammeDetails.forEach(learner => {
          this.learnerIds.push({
            'learnerId': learner.learnerId,
            'isCompleted': learner.isCompleted
          });

        })
    }
    this.completionForm.get('programmeCompletionDetails').get('programmeCompletionStatus').patchValue(this.programmeCompletionStatus);
    this.isProgrammeCompletedChange(this.programmeCompletionStatus);
    this.completionForm.get('programmeCompletionDetails').get('programmeActualEndDate').patchValue(this.progressAndCompletionData.programmeCompletionDetails.programmeActualEndDate);
  }

  getProgrammeCompletionDetails() {
    const programmeCompletionDetailsForm = this.formBuilder.group({
      programmeCompletionStatus: [false],
      learnerProgrammeDetails: new FormArray([]),
      programmeActualEndDate: [null, [Validators.required]]
    })
    return programmeCompletionDetailsForm;
  }

  /* this function works on change status of course and 
   it add learners under course */
  async isCourseCompletedChange(courseInd, element) {
    this.courseIndex = courseInd;
    const currentFormGroup = this.courseCompletionDetailsForm.at(courseInd) as FormGroup;
    const isCourseCompleted = currentFormGroup.get('isCourseCompleted').value;
    if (isCourseCompleted) {
      this.noAnswers.push(currentFormGroup.get('courseId').value);

      await this.pushLearnerCourseDetails(currentFormGroup, this.progressAndCompletionData.courseCompletionDetails[courseInd], courseInd);

    }
    else {
      let learnerCourseDetails = (this.courseCompletionDetailsForm.controls[courseInd] as FormGroup).get('learnerCourseDetails') as FormArray;
      learnerCourseDetails.clear();
      if (this.noAnswers.includes(currentFormGroup.get('courseId').value)) {
        this.noAnswers.splice(this.noAnswers.indexOf(currentFormGroup.get('courseId').value));
      }
    }

  }

  /* this function works on change status of programme */
  isProgrammeCompletedChange(value) {
    if (value === true || value === null) {
      if (value === null) {
        this.completionForm.get('programmeCompletionDetails').get('programmeCompletionStatus').patchValue(false);
      }
      else {
        this.completionForm.get('programmeCompletionDetails').get('programmeCompletionStatus').patchValue(value);

        this.learnerIds.forEach(learner => {
          this.learnerProgrammeDetailsForm.push(this.formBuilder.group(learner));
        })
        this.progressAndCompletionData.programmeCompletionDetails.learnerProgrammeDetails = this.learnerIds;
      }
      this.completionForm.controls.programmeCompletionDetails.get('programmeActualEndDate').clearValidators();
      this.completionForm.controls.programmeCompletionDetails.get('programmeActualEndDate').updateValueAndValidity();
    }


    else {
      this.learnerProgrammeDetailsForm.clear();
      this.completionForm.controls.programmeCompletionDetails.get('programmeActualEndDate').reset();
      this.completionForm.controls.programmeCompletionDetails.get('programmeActualEndDate').clearValidators();
      this.completionForm.controls.programmeCompletionDetails.get('programmeActualEndDate').updateValueAndValidity();
    }


  }

  onSubmit() {
    const payload = this.completionForm.getRawValue();
    payload.courseCompletionDetails.forEach(course => {
      course.learnerCourseDetails.forEach(learner => {
        if (learner.qualificationOutcomeDtos.length === 0) {
          learner.qualificationOutcomeDtos = null;
        }
        else {
          learner.qualificationOutcomeDtos.forEach((outcome) => {
            outcome.attemptDate = Utility.transformDateToString(outcome.attemptDate);
          });
        }
      })
    })

    payload.programmeDeliveryId = this.deliveryId;
    payload.programmeCompletionDetails.programmeActualEndDate = Utility.transformDateToString(payload.programmeCompletionDetails.programmeActualEndDate)
    if (this.completionForm.get('programmeCompletionDetails').get('programmeCompletionStatus').value) {
      const dialogRef = this.appConfirmService.confirm({
        title: `Progress and completion details`,
        message: `Once a programme is marked as complete, you will not be able to make further changes to this page. Do you wish to continue?`,
        okButtonLabel: 'Yes - Continue'
      });

      dialogRef.subscribe(result => {
        if (result) {
          this.saveProgressAndCompletionData(payload)
        }
      })
    }
    else {
      this.saveProgressAndCompletionData(payload)
    }
  }

  saveProgressAndCompletionData(payload) {
    this.programmeDeliveryService.saveProgressAndCompletionData(payload).subscribe((resp) => {
      this.snackBarService.success(resp.message.applicationMessage);
      this.router.navigate(['/programme-management/programme-delivery'])
    },
      (error) => {
        this.snackBarService.error(error.applicationMessage);
      })
  }

  /* get perticular course */
  get courseCompletionDetailsForm() {
    return this.completionForm.get('courseCompletionDetails') as FormArray;
  }

  getlearnerCourseDetails(courseIndex) {
    return (this.courseCompletionDetailsForm.controls[courseIndex] as FormGroup).get('learnerCourseDetails') as FormArray;
  }

  getqualificationOutcomeDetails(courseIndex, learnerIndex) {

    return (this.getlearnerCourseDetails(courseIndex).controls[learnerIndex] as FormGroup).get('qualificationOutcomeDtos') as FormArray;
  }

  /* get learner for perticular course */
  get learnerCourseDetailsForm() {
    return (this.completionForm.get('courseCompletionDetails') as FormArray).at(this.courseIndex).get('learnerCourseDetails') as FormArray;
  }

  /* get learner for entire programme */
  get learnerProgrammeDetailsForm() {
    return this.completionForm.get('programmeCompletionDetails').get('learnerProgrammeDetails') as FormArray;
  }

  get qualificationOutcomeArray() {
    return ((this.completionForm.get('courseCompletionDetails') as FormArray).at(0).get('learnerCourseDetails') as FormArray).at(0).get('qualificationOutcomeDtos') as FormArray;
  }

  isLearnerCompletedChange(learner, learnerIndex, courseIndex) {

    let innerOutcomeArray = [];
    this.learnerIndex = learnerIndex;
    this.courseIndex = courseIndex;
    const isAttended = this.getlearnerCourseDetails(courseIndex).controls[learnerIndex].get('isCompleted').value;
    if (isAttended && this.courseCompletionDetailsForm.at(courseIndex).get('hasQualification').value) {
      this.getqualificationOutcomeDetails(courseIndex, learnerIndex).clear();
      const control = this.formBuilder.group({
        outcomeId: [null],
        attemptDate: [null],
        qualificationExpiryDate: [null],
        qualificationReferenceNumber: [null, [Validators.maxLength(20), Validators.pattern(this.namePattern)]]
      });

      this.getqualificationOutcomeDetails(courseIndex, learnerIndex).push(control);
    }
    else {
      this.getqualificationOutcomeDetails(courseIndex, learnerIndex).clear();
    }
    this.deliveryStartDate = this.courseCompletionDetailsForm.at(0).get('startDate').value;
    this.deliveryEndDate = this.courseCompletionDetailsForm.at(this.courseCompletionDetailsForm.length - 1).get('endDate').value;
  }

  isQualificationOutcome(courseIndex, lIndex, oIndex, element) {
    this.learnerIndex = lIndex;
    const currentFormGroup = this.getlearnerCourseDetails(courseIndex).at(lIndex);
    if (element === 1) {
      this.isQualificationOutcomePassed(currentFormGroup, oIndex)
    }
  }

  onattemptDateChange(event, lIndex, oIndex) {
    const qualificationArray = this.learnerCourseDetailsForm.at(lIndex).get('qualificationOutcomeDtos') as FormArray
    qualificationArray.at(oIndex).get('qualificationExpiryDate').reset();
  }

  addAttempt(courseIndex, lIndex) {
    this.courseIndex = courseIndex
    if (this.getqualificationOutcomeDetails(courseIndex, lIndex).controls.length > 0) {
      const control = this.formBuilder.group({
        outcomeId: [null],
        attemptDate: [null],
        qualificationExpiryDate: [null],
        qualificationReferenceNumber: [null, [Validators.maxLength(20), Validators.pattern(this.namePattern)]]
      })
      this.getqualificationOutcomeDetails(courseIndex, lIndex).push(control)
    }
  }

  onDelete(courseIndex, learnerIndex, oIndex) {
    this.learnerIndex = learnerIndex;
    this.getqualificationOutcomeDetails(courseIndex, learnerIndex).removeAt(oIndex);
    this.isQualificationOutcomePassed(this.getlearnerCourseDetails(courseIndex).at(learnerIndex), oIndex - 1)
  }

  isQualificationOutcomePassed(currentFormGroup, oIndex) {

    const qualificationArray = currentFormGroup.get('qualificationOutcomeDtos') as FormArray

    if (oIndex === qualificationArray.length - 1) {
      qualificationArray.at(oIndex).get('outcomeId').setErrors(null)
      this.noAnswers.push(currentFormGroup.get('learnerId').value);
    }
    else {
      for (let i = 0; i < qualificationArray.length - 1; i++) {
        if (qualificationArray.at(i).get('outcomeId').value === 1) {
          qualificationArray.at(i).get('outcomeId').setErrors({ incorrect: true })
        }
      }
    }
  }

  islearnerExpanded(value) {
    this.learnerCourseDetailsForm
  }
}