import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ManageUsersService } from '../../../../features/manage-users/manage-users.service';
import { RegexPattern } from '../../../../framework/constants/regex-constant';
import { SnackBarService } from '../../../..//framework/service/snack-bar.service';
import { ProgrammesService } from '../../programmes/programmes.service';
import { ProgrammeDeliveryService } from '../programme-delivery.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { Utility } from 'src/app/framework/utils/utility';
import * as moment from 'moment';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProgrammeDeliveryNavigation } from '../programme-delivery-nav';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Component({
  selector: 'app-add-programme-delivery',
  templateUrl: './add-programme-delivery.component.html',
  styleUrls: ['./add-programme-delivery.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check' } },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, useStrict: true } }
  ]
})
export class AddProgrammeDeliveryComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  programmeDeliveryForm: FormGroup;
  programmeNamePattern = RegexPattern.allCharPattern;
  capacityPattern = /^[0-9]+$/;
  formData;
  isDisable = true;
  filterBySU = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('suAppId') };
  filterBy = { keyword: null };
  isNew = true;
  filteredProgrammes: Array<any> = [];
  ListOfCourses: any = [];
  pageSize = 10;
  showPaginationForProgramme = false;
  showPaginationForLearner = false;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['courseCode', 'courseName', 'tutor', 'startDate', 'endDate'];
  showDiv = true;
  currentDate: moment.Moment = moment().hours(0).minutes(0).seconds(0);
  firstStartDate = null;
  lastEndDate = null;
  filterQualification = [];
  filteredCourses = [];
  allLearners: any = [];
  filteredLearner: Array<any> = [];
  lAndCIndex;
  sortColumn = 'fullName';
  sortDirection = 'asc';
  startDate: moment.Moment = moment().hours(0).minutes(0).seconds(0);
  endDate: moment.Moment = moment().hours(0).minutes(0).seconds(0);
  coursesFormArrayControl = this.fb.array([])
  tutors;
  coursesPerLearnerList = [];
  enrolledLearners: any = [];
  allProgrammes: any = [];
  learnerCourseAttendenceList: any = []
  showEnrollment = false;
  courseProgrammeIds: any = [];
  responseOnUpdate: any;
  showCourseLearnerList = false;
  isCourseCompletedArray: any[] = [];
  isProgramCompleted: boolean;

  learnerAndCoursesEnrollment = this.fb.array([
    this.fb.group({
      learnerId: [null, [Validators.required]],
      learnerName: [null, [Validators.required]],
      courseProgrammeIds: [null, [Validators.required]],
      coursesPerLearnerNameList: [null]
    })
  ])

  manageUserService: ManageUsersService;
  programmeDeliveryService: ProgrammeDeliveryService;
  programmesService: ProgrammesService;
  learnerService: LearnersService;
  changeDetectorRef: ChangeDetectorRef;
  snackBarService: SnackBarService
  conflictCourseIds:any[] = [];
  courseLearnerMapping = new Map();
  tempLearnerSelectedCourseArray: any[];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly injector: Injector,
    private readonly appConfirmService: AppConfirmService,
    private readonly inPageNavService: InPageNavService,
    private readonly programmeDeliveryNavigation: ProgrammeDeliveryNavigation
  ) {
    this.manageUserService = this.injector.get(ManageUsersService);
    this.programmeDeliveryService = this.injector.get(ProgrammeDeliveryService);
    this.programmesService = this.injector.get(ProgrammesService);
    this.learnerService = this.injector.get(LearnersService);
    this.changeDetectorRef = this.injector.get(ChangeDetectorRef);
    this.snackBarService = this.injector.get(SnackBarService);
  }
  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  ngOnInit() {
    this.resolveCoursesAndTutors();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  resolveCoursesAndTutors() {
    forkJoin([
      this.programmesService.getAllProgrammeCourses(),
      this.getTeacherList(),
      this.manageUserService.getAllSuUserByLggedInClient(),
      this.programmesService.getAllprogramme(),
    ]).subscribe(data => {
      this.ListOfCourses = data[0];
      this.tutors = data[1];
      this.allLearners = data[2]
      this.allProgrammes = data[3]
      this.resolveProgrammeDelivery();
    })

  }

  private getTeacherList() {
    if (BaseUrl.CLIENT_URL.includes('rmf')) {
      return this.manageUserService.getUserDetailsByRoleIdentifierAndAppId(['CMPLTTR', 'RMFCMPLTTR'], localStorage.getItem('ApplicationID'));
    }
    else {
      return this.manageUserService.getFilterUserList(5);
    }
  }

  resolveProgrammeDelivery() {
    this.initProgrammeDeliveryForm();

    this.activatedRoute.queryParams.subscribe((params: any) => {

      if (params.id) {
        
        this.inPageNavService.setNavItems(this.programmeDeliveryNavigation.programmeDeliverySubMenu);

        this.programmeDeliveryForm.get('id').patchValue(params.id)

        this.programmeDeliveryService.getLearnerCourseAttendenceList(params.id).subscribe((list) => {
          this.learnerCourseAttendenceList = list
        })

        this.programmeDeliveryService.getProgrammeDeliveryDetails(params.id).subscribe((resp) => {
          this.isProgramCompleted = resp.isProgramCompleted;
          this.responseOnUpdate = resp;

          const programme = this.allProgrammes.find(data => data.id === resp.programmeId)

          this.programmeDeliveryForm.controls.programmeName.patchValue(programme.programmeName)
          this.programmeDeliveryForm.controls.programmeId.patchValue(programme.id);
          this.programmeDeliveryForm.controls.programmeName.disable();

          resp.programmeCourseDelivery.forEach(element => {
            const courseObj = this.ListOfCourses.find(data => data.courseProgrammeId === element.courseProgrammeId)

            if (courseObj) {
              const control = this.fb.group({
                courseProgrammeId: [element.courseProgrammeId],
                courseName: [courseObj.courseName],
                courseCode: [courseObj.courseCode],
                tutorId: [element.tutorId],
                startDate: [element.startDate],
                endDate: [element.endDate]
              });
              this.coursesFormArray.push(control);
            }

          })
          this.dataSource.data = this.coursesFormArray.value;

          //Enrolled learners
          this.learnerEnrollment(resp, params.id);

        })
        this.isNew = false;
        this.showCourseLearnerList = true;

      }
    })

  }

  /* this method will be executed at the time of edit programme delivery*/
  learnerEnrollment(resp, programmeDeliveryId?) {
    this.learnerAndCoursesEnrollmentFormArray.removeAt(0);
    let courseControl = this.coursesFormArray.getRawValue();
    let learnerIds = [];
    this.isCourseCompletedArray = resp.programmeCourseDelivery.map(data=>data.isCourseCompleted)

    this.setProgrameDeliveryStartDateAndEndDate(resp.programmeCourseDelivery);
  
    resp.learnerEnrollments.forEach(learner => {

      courseControl.forEach((course) => {

        const courseObj = Utility.getObjectFromArrayByKeyAndValue(this.ListOfCourses, 'courseProgrammeId', course.courseProgrammeId);

        let isPresent = false;
        if (this.coursesPerLearnerList.length > 0) {

          this.coursesPerLearnerList.forEach((courseProgramme) => {

            if (courseObj.courseProgrammeId !== null && courseObj.courseProgrammeId === courseProgramme.courseProgrammeId) {
              isPresent = true;
            }
          })
        }

        if (!isPresent) {
          this.coursesPerLearnerList.push(courseObj)
        }

      })

      const learnerObj = Utility.getObjectFromArrayByKeyAndValue(this.allLearners, 'id', learner.learnerId)
      
      let courseNameList = [];
      learner.courseProgrammeIds.forEach(courseProgrammeId => {
        let course = this.coursesPerLearnerList.filter(data => data.courseProgrammeId === courseProgrammeId)
        courseNameList.push(course[0]?.courseName)
      });

      if (learnerObj) {

        const fullName = learnerObj.firstName + " " + learnerObj.lastName
        const control = this.fb.group({
          learnerId: [learner.learnerId],
          learnerName: [fullName],
          courseProgrammeIds: [learner.courseProgrammeIds],
          coursesPerLearnerNameList: [courseNameList]
        })

        if (!learnerIds.includes(learner.learnerId)) {
          this.learnerAndCoursesEnrollmentFormArray.push(control)
          learnerIds.push(learner.learnerId);
        }
        this.learnerCourseMapping(learner.courseProgrammeIds, learner)
      }

    })
    this.learnerAndCoursesEnrollmentFormArray.controls.forEach(control => {
      if(this.isProgramCompleted) {
        control.get('learnerName').disable();
        control.get('courseProgrammeIds').disable();
      }
      
    })
  }

  initProgrammeDeliveryForm() {
    this.programmeDeliveryForm = this.fb.group({
      id: [null],
      programmeId: [null, [Validators.required]],
      programmeName: [null,[Validators.required,]],
      programmeCourseDelivery: this.coursesFormArrayControl,
      learnerEnrollments: this.learnerAndCoursesEnrollment
    })

  }

  /* multiselect dropdown for course*/
  onSelectCourse(courseProgrammeIds, i) {
    this.lAndCIndex = i;
    const programmeCourses = this.coursesFormArray.value;
    const learnerDetail = this.learnerAndCoursesEnrollmentFormArray.at(this.lAndCIndex).value
    const existingLearnerCourseData = this.courseLearnerMapping.get(learnerDetail.learnerId)

    if (this.checkAllCourseHaveDate(programmeCourses)) {
      if (!this.courseLearnerMapping.has(learnerDetail.learnerId)) {
        this.learnerCourseMapping(courseProgrammeIds, learnerDetail)
      }
      else {
        if (this.courseLearnerMapping.get(learnerDetail.learnerId).length === 0) {
          this.learnerCourseMapping(courseProgrammeIds, learnerDetail);
        }

        let tempIncomingIds = [];
        courseProgrammeIds.forEach(incomingCourseId => {
          if (!existingLearnerCourseData.some(data => data.courseProgrammeId === incomingCourseId)) {
            const incomingCourseDetail = programmeCourses.find(data => data.courseProgrammeId == incomingCourseId)
            let flag = true;
            existingLearnerCourseData.forEach(exCourseData => {

              if (this.checkCourseOverlapping(exCourseData, incomingCourseDetail)) {
                flag = false;

                this.snackBarService.error("Cannot enroll, concurrent courses found in selected learners")

                this.learnerAndCoursesEnrollmentFormArray.at(this.lAndCIndex).get('courseProgrammeIds')
                  .patchValue(courseProgrammeIds
                    .filter(data => data !== incomingCourseDetail.courseProgrammeId));
              }
            })
            if (flag) {
              this.learnerAndCoursesEnrollmentFormArray.at(this.lAndCIndex).get('courseProgrammeIds')
                .patchValue(courseProgrammeIds)
              tempIncomingIds.push(incomingCourseId);
              this.courseLearnerMapping.set(learnerDetail.learnerId, this.tempLearnerSelectedCourseArray);
              this.setCourseName(courseProgrammeIds);
            }
          }
          else {
            tempIncomingIds.push(incomingCourseId);
          }

        });

        this.learnerCourseMapping(tempIncomingIds, learnerDetail);
      }
    }
  }
  
  /* this method checks learner attendence for 
    perticular course at the time of course removal*/
  checkLearnerAttendance(control, courseProgrammeId, learnerId, i, CourseProgrammeNameControl, courseName) {
    let tempCourseProgrammeIds = [];

    if (!this.isNew) {
      let remainingCourseProgrammeIds: any[] = control.value;
      let remainingCourseProgrammeName: any[] = CourseProgrammeNameControl.value;
      let learnerCourseAttendance = this.learnerCourseAttendenceList.filter(data => data.learnerId === learnerId)
      if (learnerCourseAttendance) {

        learnerCourseAttendance = learnerCourseAttendance.map(data => data.courseProgramId)

        if (learnerCourseAttendance.includes(courseProgrammeId)) {
          tempCourseProgrammeIds.push(courseProgrammeId);
          remainingCourseProgrammeIds.push(courseProgrammeId)
          remainingCourseProgrammeName.push(courseName)
          this.learnerAndCoursesEnrollmentFormArray.at(i).get('courseProgrammeIds').reset();
          this.learnerAndCoursesEnrollmentFormArray.at(i).get('coursesPerLearnerNameList').reset();
          this.learnerAndCoursesEnrollmentFormArray.at(i).get('courseProgrammeIds').patchValue(remainingCourseProgrammeIds);
          this.learnerAndCoursesEnrollmentFormArray.at(i).get('coursesPerLearnerNameList').patchValue(remainingCourseProgrammeName);
          this.snackBarService.error("Attendance is present for this course, cannot remove")
        }
      }

      /*if attendece is present then cannot disselect the course*/
      if (tempCourseProgrammeIds.length !== 0) {
        this.learnerCourseMapping(tempCourseProgrammeIds, this.learnerAndCoursesEnrollmentFormArray.at(i).value)
      }
    }

  }

  resolveLearner(pageIndex) {

    this.learnerService
      .findAllPaginated(`${this.sortColumn},${this.sortDirection}`, pageIndex, this.pageSize, this.filterBySU)
      .subscribe(
        (data: any) => {
          if (data.length !== 0) {
            this.filteredLearner = data.content
          }
          else {
            this.filteredLearner = [];
            this.filteredProgrammes = [];
          }
          if (this.filteredLearner.length === 0) {
            this.snackBarService.error("Learner not found");
            this.learnerAndCoursesEnrollmentFormArray.at(this.lAndCIndex).reset();
          }
          this.paginator.length = data.totalElements;
        },
        (error) => {
          this.snackBarService.error(error.error.errorMessage);
        }
      );
  }

  get coursesFormArray() {
    return this.programmeDeliveryForm.controls["programmeCourseDelivery"] as FormArray;
  }

  get learnerAndCoursesEnrollmentFormArray() {
    return this.programmeDeliveryForm.controls["learnerEnrollments"] as FormArray;
  }

  prevent(event) {
    event.preventDefault();
  }

  onSelectedLearner(value) {

    this.isLearnerAlreadyEnrolled(value);

    this.filteredProgrammes = [];
    this.filteredLearner = [];
  }

  isLearnerAlreadyEnrolled(value) {

    let isEnrolled = false;
    this.enrolledLearners.forEach(learner => {

      if (learner.learnerId === value.id) {
        isEnrolled = true;
        this.learnerAndCoursesEnrollmentFormArray
          .at(this.lAndCIndex).get('learnerName')
          .setErrors({ learnerEnrolled: true })

        this.learnerAndCoursesEnrollmentFormArray
          .at(this.lAndCIndex).get('courseProgrammeIds').patchValue(null)
        this.learnerAndCoursesEnrollmentFormArray
          .at(this.lAndCIndex).get('coursesPerLearnerNameList').patchValue(null)
      }
    })

    if (!isEnrolled) {
      this.isLearnerAlreadySelected(value);
    }

  }

  isLearnerAlreadySelected(value) {

    let isDublicate = false;
    for (let i = 0; i < this.learnerAndCoursesEnrollmentFormArray.length - 1; i++) {
      const learnerId = this.learnerAndCoursesEnrollmentFormArray.at(i).get('learnerId').value

      if (learnerId === value.id) {
        isDublicate = true;
        this.learnerAndCoursesEnrollmentFormArray
          .at(this.lAndCIndex).get('learnerName')
          .setErrors({ duplicateLearner: true })
        this.learnerAndCoursesEnrollmentFormArray

          .at(this.lAndCIndex).get('courseProgrammeIds').patchValue(null)
        this.learnerAndCoursesEnrollmentFormArray
          .at(this.lAndCIndex).get('coursesPerLearnerNameList').patchValue(null)

      }

    }

    if (!isDublicate) {
      this.learnerAndCoursesEnrollmentFormArray.controls[
        this.lAndCIndex
      ].patchValue({
        learnerName: value.fullName,
        learnerId: value.id,
      });
      
      this.learnerAndCoursesEnrollmentFormArray
        .at(this.lAndCIndex).get('courseProgrammeIds').patchValue(null)
      this.learnerAndCoursesEnrollmentFormArray
        .at(this.lAndCIndex).get('coursesPerLearnerNameList').patchValue(null)

      if (!this.isNew) {

        let coursesList = this.responseOnUpdate.currentDateExceededCourses

        let courseProgrammeIds = coursesList.map(data => data.courseProgrammeId)

        let courseNameList = [];
        courseProgrammeIds.forEach(courseId => {

          const courseName = Utility.getObjectFromArrayByKeyAndValue(this.coursesPerLearnerList, 'courseProgrammeId', courseId);
          courseNameList.push(courseName)

        })

        this.learnerAndCoursesEnrollmentFormArray.at(this.lAndCIndex).get("coursesPerLearnerNameList").patchValue(null)

        this.learnerAndCoursesEnrollmentFormArray.at(this.lAndCIndex).get('courseProgrammeIds').patchValue(null);

      }

    }
  }

  onDelete(cAndLIndex: number) {
    let learnerCourseAttendenceIds = this.learnerCourseAttendenceList.map(data => data.learnerId)
    if (!this.isNew) {
      let learnerId = this.learnerAndCoursesEnrollmentFormArray.at(cAndLIndex).get('learnerId').value;
      if (learnerCourseAttendenceIds.includes(learnerId)) {
        this.snackBarService.error("Attendance is present learner, cannot remove")
      }
      else {
        this.learnerAndCoursesEnrollmentFormArray.removeAt(cAndLIndex);
      }
      this.filteredProgrammes = [];
      this.filteredLearner = [];
    }

    if (this.isNew) {
      this.learnerAndCoursesEnrollmentFormArray.removeAt(cAndLIndex);
      this.filteredProgrammes = [];
      this.filteredLearner = [];
    }

  }

  onAddLearnerAndCoursesEnrollment() {

    const addLearnerAndCoursesEnrollmentForm = this.fb.group({
      learnerId: [null, [Validators.required]],
      learnerName: [null, [Validators.required]],
      courseProgrammeIds: [null, [Validators.required]],
      coursesPerLearnerNameList: [null]
    });

    this.learnerAndCoursesEnrollmentFormArray.push(
      addLearnerAndCoursesEnrollmentForm
    );

    this.filteredProgrammes = [];
    this.filteredLearner = [];
  }

  onFilterLearner(filterValue: string, index) {
    this.learnerAndCoursesEnrollmentFormArray.controls[index].patchValue({
      learnerId: null,
    });
    this.showPaginationForProgramme = false;
    this.showPaginationForLearner = true;
    this.lAndCIndex = index;
    this.filterBySU.keyword = filterValue;
    this.filteredProgrammes = [];
    if (this.paginator === undefined) {
      this.resolveLearner(0);
    } else {
      this.paginator.pageIndex = 0;
      this.resolveLearner(this.paginator.pageIndex);
    }
  }

  onFilterKeyupLearner(filterValue: string, index) {
    this.lAndCIndex = index;
    if (filterValue === null || filterValue === '') {
      this.onFilterLearner(filterValue, index);
      this.learnerAndCoursesEnrollmentFormArray.at(this.lAndCIndex).get('courseProgrammeIds').patchValue(this.coursesPerLearnerList.map(data => data.courseProgrammeId));
    }
  }

  startDateValidation(index, value) {
    
    this.setProgrameDeliveryStartDateAndEndDate(this.coursesFormArray.getRawValue());

    const modifyCurrentDateToString = Utility.transformDateToString(this.currentDate)
    const momentCurrentDate = Utility.transformStringToMomentDate(modifyCurrentDateToString);

    const startDateToString = Utility.transformDateToString(value);
    this.startDate = Utility.transformStringToMomentDate(startDateToString);

    const endDateToString = Utility.transformDateToString(this.coursesFormArray.at(index).get('endDate').value);
    this.endDate = Utility.transformStringToMomentDate(endDateToString);

    this.endDate = this.coursesFormArray.at(index).get('endDate').value;
    if (this.startDate > this.endDate && this.endDate !== null) {
      this.coursesFormArray.at(index).get('endDate').setErrors({ endDateGreaterThanStartDate: true });
    }
    else {
      this.coursesFormArray.at(index).get('endDate').reset();
    }

    if (this.endDate < this.startDate && this.endDate !== null) {
      this.coursesFormArray.at(index).get('endDate').setErrors({ endDateGreaterThanStartDate: true })
    }

    if (this.learnerAndCoursesEnrollmentFormArray.value) {
      setTimeout(() => {
        this.beforeDateSelectedLearnerValidation();
      }, 1000);
    }

    this.checkCourseConflicts();
  }


  endDateValidation(index, value) {

    this.setProgrameDeliveryStartDateAndEndDate(this.coursesFormArray.getRawValue());

    const startDateToString = Utility.transformDateToString(this.coursesFormArray.at(index).get('startDate').value);
    this.startDate = Utility.transformStringToMomentDate(startDateToString);

    const endDateToString = Utility.transformDateToString(value);
    this.endDate = Utility.transformStringToMomentDate(endDateToString);

    if (this.endDate < this.startDate) {
      this.coursesFormArray.at(index).get('endDate').setErrors({ endDateGreaterThanStartDate: true });
    }

    if (this.learnerAndCoursesEnrollmentFormArray.value) {
      setTimeout(() => {
        this.beforeDateSelectedLearnerValidation();
      }, 1000);
    }

    this.checkCourseConflicts();
  }

  /* this checks if learner is already selected before 
   selecting start date and end date of the delivery */
  beforeDateSelectedLearnerValidation() {

    let learnerAlreadySelected = this.learnerAndCoursesEnrollmentFormArray.value
    let enrolledLearnerIds;

    enrolledLearnerIds = this.enrolledLearners.map(data => data.learnerId)

    for (let i = 0; i < learnerAlreadySelected.length; i++) {

      if (enrolledLearnerIds.includes(learnerAlreadySelected[i].learnerId)) {
        this.learnerAndCoursesEnrollmentFormArray
          .at(i).get('learnerName')
          .setErrors({ learnerEnrolled: true })
      }
      else {
        this.learnerAndCoursesEnrollmentFormArray
          .at(i).get('learnerName')
          .setErrors(null)
      }
    }
  }

  onSubmit() {
    this.isNew ? this.createProgrammeDelivery() : this.onUpdateProgrammeDelivery();
  }

  onUpdateProgrammeDelivery() {
    const payload = this.programmeDeliveryForm.getRawValue();

    this.currentDate = Utility.dateToString(this.currentDate)

    if(this.firstStartDate < this.currentDate) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Programme delivery`,
      message: `If you have added a Learner to a course that has already started, you may need to update and re-submit any session attendance in order for that learner to appear in attendance reports`,
      okButtonLabel:'Accept & Continue'
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.programmeDeliveryService.updateProgrammeDelivery(payload).subscribe(resp => {
          this.router.navigate(["programme-management/programme-delivery"]);
          this.snackBarService.success(resp.message.applicationMessage);
        },
          (error) => {
            this.snackBarService.error(error.error.applicationMessage);
          }
        )
      }
    })
  }
  else {
    this.programmeDeliveryService.updateProgrammeDelivery(payload).subscribe(resp => {
      this.router.navigate(["programme-management/programme-delivery"]);
      this.snackBarService.success(resp.message.applicationMessage);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    )
  }

  }

  createProgrammeDelivery() {
    const payload = this.programmeDeliveryForm.getRawValue();
    this.programmeDeliveryService.createProgrammeDelivery(payload).subscribe(resp => {
      let messege = resp.message.applicationMessage;
      if (resp.responseObject.rejectedLearners.length > 0) {
        messege = messege + " and " + resp.rejectedLearners.length + " learners rejected"
      }
      this.router.navigate(["programme-management/programme-delivery"]);
      this.snackBarService.success(messege);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    )
  }

  onFilter(filterValue: string) {
    if (filterValue === '' || filterValue === null) {
      this.programmeDeliveryForm.controls.programmeName.patchValue(null);
    }
    this.showCourseLearnerList = false;
    this.showPaginationForLearner = false;
    this.showPaginationForProgramme = true;
    this.filterBy.keyword = filterValue
    if (this.paginator === undefined) {
      this.resolveProgrammes(0);
    } else {
      this.paginator.pageIndex = 0;
      this.resolveProgrammes(this.paginator.pageIndex);
    }
    this.filteredLearner = [];
  }

  onFilterKeyupProgramme(filterValue: string) {
    if (filterValue === null || filterValue === '') {
      this.onFilter(filterValue);
    }
  }

  resolveProgrammes(pageIndex) {
    this.programmesService
      .findAllPaginated(this.sortDirection, pageIndex, this.pageSize, this.filterBy)
      .subscribe(
        (data: any) => {
          if (data.length !== 0) {
            this.filteredProgrammes = data.content
          }
          else {
            this.filteredProgrammes = []
          }
          this.paginator.length = data.totalElements;
        },
        (error) => {
          this.snackBarService.error(error.error.errorMessage);
        }
      );
  }

  onPaginateChange() {
    if (this.filteredProgrammes.length > 0) {
      this.resolveProgrammes(this.paginator.pageIndex);
    }
  }

  onLearnerPaginateChange() {
    if (this.filteredLearner.length > 0) {
      this.resolveLearner(this.paginator.pageIndex);
    }
  }

  onSelectedProgramme(value) {
    this.programmeDeliveryForm.controls.programmeName.patchValue(value.programmeName);
    this.programmeDeliveryForm.controls.programmeId.patchValue(value.id);
    this.showCourseLearnerList = true
    this.filteredProgrammes = [];
    this.getListOfCoursesPerProgramme(value.id);
  }

  getListOfCoursesPerProgramme(id: number) {
    this.coursesFormArray.clear();
    const filterdList = this.ListOfCourses.filter(data => data.programmeId === id);
    this.coursesPerLearnerList = filterdList;

    filterdList.forEach(element => {
      const control = this.fb.group({
        courseProgrammeId: [element.courseProgrammeId],
        courseName: [element.courseName],
        courseCode: [element.courseCode],
        tutorId: [null],
        startDate: [null],
        endDate: [null]
      });

      this.coursesFormArray.push(control);
    })
    this.dataSource.data = this.coursesFormArray.value;

  }

  handleEnterKeyPress(event) {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== "textarea") {
      return false;
    }
    event.preventDefault();
    return true;
  }

  setProgrameDeliveryStartDateAndEndDate(courses) {

    const startDateArray = courses.map(data => data.startDate).sort((a, b) => a - b);
    const endDateArray = courses.map(data => data.endDate).sort((a, b) => a - b);

    this.firstStartDate = Utility.transformDateToString(startDateArray[0]);
    this.lastEndDate = Utility.transformDateToString(endDateArray[endDateArray.length - 1]);

    if (!startDateArray.includes(null) && !endDateArray.includes(null)) {
      this.programmeDeliveryService.getEnrolledLearners(this.firstStartDate, this.lastEndDate).subscribe((data) => {
        this.enrolledLearners = data;
      });
    }

  }

  checkCourseOverlapping(exCourseData, incomingCourseDetail) {
    let returnFlag = false;
    if (((incomingCourseDetail.startDate >= exCourseData.startDate && incomingCourseDetail.startDate <= exCourseData.endDate) ||
      (incomingCourseDetail.endDate >= exCourseData.startDate && incomingCourseDetail.endDate <= exCourseData.endDate))
      || (exCourseData.startDate <= incomingCourseDetail.endDate &&
        incomingCourseDetail.startDate <= exCourseData.endDate)) {
      returnFlag = true;
    }
    return returnFlag;
  }

  checkAllCourseHaveDate(programmeCourses): Boolean {
    let checkDateIsNull = true;
    programmeCourses.some(courseDetail => {
      if (courseDetail.startDate === null || courseDetail.endDate === null) {
        checkDateIsNull = false;
      }
    });
    return checkDateIsNull;
  }

  /**
   * mapping of learner and list of course detail
   */
  learnerCourseMapping(courseProgrammeIds, learnerDetail) {

    this.tempLearnerSelectedCourseArray = [];

    courseProgrammeIds.forEach(courseId => {
      let courseDetails = Utility.getObjectFromArrayByKeyAndValue(this.coursesFormArray.value, 'courseProgrammeId', courseId)
      this.tempLearnerSelectedCourseArray.push(courseDetails);
    })
    this.courseLearnerMapping.set(learnerDetail.learnerId, this.tempLearnerSelectedCourseArray);

    this.setCourseName(courseProgrammeIds);
  }

  setCourseName(courseProgrammeIds) {

    let courseNameList = [];
    courseProgrammeIds.forEach(courseProgrammeId => {
      let course = this.coursesPerLearnerList.filter(data => data.courseProgrammeId === courseProgrammeId)
      courseNameList.push(course[0]?.courseName)
    });

    this.learnerAndCoursesEnrollmentFormArray.at(this.lAndCIndex)?.get('coursesPerLearnerNameList').patchValue(courseNameList)
  }

  /**
     * Remove selected conflict courses,
     *  which are selected before course dates insert
     */
  removeConflictCourseFromLearner() {
    const programmeDelivery = this.programmeDeliveryForm.value
    let lernerEnrolled = programmeDelivery.learnerEnrollments
    if (lernerEnrolled[0].learnerId != null && lernerEnrolled[0].courseProgrammeIds !== null) {

      lernerEnrolled.forEach((learner, i) => {

        let tempCourseProgrammeIds = [];
        let tempCourseNameList = [];

        learner.courseProgrammeIds.forEach(cpId => {
          if (!this.conflictCourseIds.includes(cpId)) {
            tempCourseProgrammeIds.push(cpId);
            const courseObj = Utility.getObjectFromArrayByKeyAndValue(this.ListOfCourses, 'courseProgrammeId', cpId);
            tempCourseNameList.push(courseObj.courseName);
          }
        })
        this.learnerAndCoursesEnrollmentFormArray.at(i).get('courseProgrammeIds').patchValue(tempCourseProgrammeIds);
        this.learnerAndCoursesEnrollmentFormArray.at(i).get('coursesPerLearnerNameList').patchValue(tempCourseNameList);

        this.learnerCourseMapping(tempCourseProgrammeIds, learner)
      })
    }
  }

  /**
    * check conflicts courses on date change
    */
  checkCourseConflicts() {

    this.conflictCourseIds = [];
    let programmeDelivery = this.programmeDeliveryForm.value
    programmeDelivery.programmeCourseDelivery.forEach(course1 => {
      programmeDelivery.programmeCourseDelivery.forEach(course2 => {

        if (course1.startDate &&
          course2.startDate &&
          course1.endDate &&
          course2.endDate &&
          course1.courseProgrammeId !== course2.courseProgrammeId &&
          ((
            (course2.startDate >= course1.startDate && course2.startDate <= course1.endDate) ||
            (course2.endDate >= course1.startDate && course2.endDate <= course1.endDate)
          ) &&
            !this.conflictCourseIds.includes(course2.courseProgrammeId) &&
            (course1.startDate <= course2.endDate && course2.startDate <= course1.endDate))) {

          this.conflictCourseIds.push(course2.courseProgrammeId)
        }
      })
    })

    this.removeConflictCourseFromLearner();
  }
}
