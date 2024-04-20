
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CourseSetupService } from 'src/app/features/admin/course-setup/course-setup.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { LearnersService } from 'src/app/features/learners/learners.services';

import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { MatTableDataSource } from '@angular/material/table';
import { log } from 'console';
import { Component, Injector, OnInit } from '@angular/core';
import { CourseDetails, QualificationStatus } from '../view-progress-completion.interface';
import { ProgrammeDeliveryService } from '../../../programme-delivery.service';
import { ViewProgrammeDeliveryNavigation } from '../../../view-programme-delivery/view-programme-delivery-nav';
import { ViewProgressCompletionSteps } from '../view-progress-completion-steps';
@Component({
  selector: 'app-progress-completions',
  templateUrl: './progress-completions.component.html',
  styleUrls: ['./progress-completions.component.scss']
})
export class ProgressCompletionsComponent implements OnInit {


  deliveryId: any;
  programmeName: any;
  programmeDeliveryService: ProgrammeDeliveryService;
  progressCompletionData: any;
  courseService: CourseSetupService;
  allListOfCourse: any;
  manageUserService: ManageUsersService;
  allLearners: any;
  finalList: any;
  courseDetails: CourseDetails[] = [];
  qualificationStatusRefData: QualificationStatus[];
  selectedCourse: CourseDetails;
  displayedColumns: string[] = ['learnersName', 'courseCompleted'];
  qualificationColumns: string[] = ['attemptDate', 'qualificationOutcome', 'expiryDate', 'referenceId']
  learnerCourseDetails: any;

  constructor(
    private readonly viewProgrammeDeliveryNavigation: ViewProgrammeDeliveryNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly route: ActivatedRoute,
    private readonly injector: Injector,
    private readonly learnersService: LearnersService,
    private readonly stepperNavigationService:StepperNavigationService,
    private readonly viewProgressCompletionSteps: ViewProgressCompletionSteps
  ) {
    this.stepperNavigationService.stepper(this.viewProgressCompletionSteps.stepsConfig);
    this.programmeDeliveryService = this.injector.get(ProgrammeDeliveryService);
    this.courseService = this.injector.get(CourseSetupService);
    this.manageUserService = this.injector.get(ManageUsersService);
  }

  ngOnInit(): void {
    this.inPageNavService.setNavItems(this.viewProgrammeDeliveryNavigation.programmeDeliverySubMenu);
    this.resolveProgressCompletion();
  }

  resolveProgressCompletion() {
    this.route.queryParams.subscribe((params: any) => {
      this.deliveryId = params.id
      this.programmeName = params.pname
      forkJoin([
        this.courseService.getAllCourses(),
        this.manageUserService.getAllSuUserByLggedInClient(),
        this.programmeDeliveryService.getProgressAndCompletionData(params.id),
        this.learnersService.getRefData()
      ]).subscribe(data => {
        this.allListOfCourse = data[0];
        this.allLearners = data[1];
        this.progressCompletionData = data[2];
        this.qualificationStatusRefData = data[3]?.qualificationStatus;
        this.resolveCourseDetails();
      })
    })
  }

  resolveCourseDetails() {
    for (const course of this.allListOfCourse) {
      const obj = this.progressCompletionData.courseCompletionDetails.find(data => data.courseId === course.id);
      if (obj) {
        const combinedData = {
          courseId: obj?.courseId,
          courseName: course?.courseName,
          isCourseCompleted: obj?.isCourseCompleted,
          learnerCourseDetails: []
        }
        if (obj?.isCourseCompleted) {
          combinedData.learnerCourseDetails = this.resolveLearnerInfo(obj?.learnerCourseDetails);
        }
        this.courseDetails.push(combinedData);
      }
    }
    if(this.courseDetails.length>0){
    this.courseDetails.sort(this.sortByCourseCompletedFirst);
    if(this.courseDetails[0].isCourseCompleted){
      this.selectedCourse = this.courseDetails[0];
      this.learnerCourseDetails = this.selectedCourse.learnerCourseDetails;
    }
    }
  }

  resolveLearnerInfo(learnerCourseDetails: any): any[] {
    let currentCourseLearners = [];
    for (const learner of this.allLearners) {
      const obj = learnerCourseDetails.find(data => data.learnerId === learner.id);
      if (obj) {
        const requiredLearnedInfo = {
          learnerId: obj.learnerId,
          firstName: learner.firstName,
          lastName: learner.lastName,
          isCompleted: obj.isCompleted,
          qualificationOutcome: []
        }
        if (obj?.isCompleted) {
          requiredLearnedInfo.qualificationOutcome = this.resolveQualificationInfo(obj?.qualificationOutcomeDtos);
        }
        currentCourseLearners.push(requiredLearnedInfo);
      }
    }
    return currentCourseLearners;
  }

  resolveQualificationInfo(qualificationOutcomeDtos: any): any[] {
    if (qualificationOutcomeDtos.length > 0) {
      qualificationOutcomeDtos.forEach(outcome => {
        const refData = this.qualificationStatusRefData.find(obj => obj.id === outcome.outcomeId);
        if (refData) {
          outcome.value = refData.value;
        }
      })
    }
    return qualificationOutcomeDtos;

  }

  sortByCourseCompletedFirst(a, b) {
    if (a?.isCourseCompleted == b?.isCourseCompleted) {
      return a.courseId - b.courseId
    }
    else {
      return b.isCourseCompleted - a.isCourseCompleted
    }
  }

  onCourseClick(course: CourseDetails) {
    if(course.isCourseCompleted){
      this.selectedCourse = course;
      this.learnerCourseDetails = this.selectedCourse.learnerCourseDetails;
    }   
  }

}
