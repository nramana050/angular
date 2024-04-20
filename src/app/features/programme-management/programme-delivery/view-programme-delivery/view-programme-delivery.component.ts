import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProviderSetupService } from 'src/app/features/admin/provider-setup/provider-setup.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProgrammesService } from '../../programmes/programmes.service';
import { ProgrammeDeliveryService } from '../programme-delivery.service';
import { ViewProgrammeDeliveryNavigation } from './view-programme-delivery-nav';

@Component({
  selector: 'app-view-programme-delivery',
  templateUrl: './view-programme-delivery.component.html',
  styleUrls: ['./view-programme-delivery.component.scss']
})
export class ViewProgrammeDeliveryComponent implements OnInit, OnDestroy {

  programmeDetails: any;
  providerList: any = [];
  userId;
  ListOfCourses: any[] = []
  tutors: any;
  allLearners: undefined;
  displayedColumns: string[] = ['courseName', 'tutor', 'startDate', 'endDate'];
  dataSource = new MatTableDataSource();
  programmeCourseArray: any[] = [];
  enrolledLearners: any[] = [];
  learnerCourseArray: any[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly providerSetupService: ProviderSetupService,
    private readonly programmeDeliveryService: ProgrammeDeliveryService,
    private readonly programmeService: ProgrammesService,
    private readonly manageUserService: ManageUsersService,
    private readonly viewProgrammeDeliveryNavigation: ViewProgrammeDeliveryNavigation,
    private readonly inPageNavService: InPageNavService
  ) {
  }

  async ngOnInit() {
    this.inPageNavService.setNavItems(this.viewProgrammeDeliveryNavigation.programmeDeliverySubMenu);
    await this.resolveCoursesAndTutors();
    this.resolveProgrammeDelivery();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  resolveProgrammeDelivery() {
    this.activatedRoute.queryParams.subscribe((params: any) => {

      if (params.id) {

        this.userId = params.id
        this.programmeDeliveryService.getProgrammeDeliveryDetails(params.id).subscribe((resp) => {
          this.getProgrammeDetail(resp.programmeId)
          resp.programmeCourseDelivery.forEach(element => {
            const courseObj = this.ListOfCourses.filter(data => data.courseProgrammeId === element.courseProgrammeId)[0]
            const tutor = this.tutors.filter(data => data.id === element.tutorId)[0]
            if (courseObj) {
              const control = {
                courseProgrammeId: element.courseProgrammeId,
                courseName: courseObj.courseName,
                courseCode: courseObj.courseCode,
                tutorName: tutor?.fullName,
                startDate: element.startDate,
                endDate: element.endDate,
                hasQualification: courseObj.hasQualification
              }
              this.programmeCourseArray.push(control);
            }

          })
          this.dataSource.data = this.programmeCourseArray

          // Enrolled learners
          this.learnerEnrollment(resp);

        })
      }
    })
  }

  learnerEnrollment(resp) {
    resp.learnerEnrollments.forEach(learner => {
      let learnerObj = Utility.getObjectFromArrayByKeyAndValue(this.allLearners, 'id', learner.learnerId)
      let learnerCourses = [];
      learner.courseProgrammeIds.forEach(courseId => {
        Utility.getObjectFromArrayByKeyAndValue(this.allLearners, 'id', learner.learnerId)
        learnerCourses.push(this.programmeCourseArray.filter(data => data.courseProgrammeId === courseId)[0])
      })
      this.enrolledLearners.push({
        learnerId: learner.learnerId,
        lernerFullName: learnerObj.firstName + ' ' + learnerObj.lastName,
        learnerCourses: learnerCourses,
        isExpanded: false
      })

    });
  }

  resolveCoursesAndTutors() {
    return new Promise(resolve => {
      forkJoin([
        this.programmeService.getAllProgrammeCourses(),
        this.manageUserService.getUserDetailsByRoleIdentifierAndAppId('CMPLTTR', localStorage.getItem('ApplicationID')),
        this.manageUserService.getAllSuUserByLggedInClient(),
        this.providerSetupService.getAllProviders()
      ]).subscribe(data => {
        this.ListOfCourses = data[0];
        this.tutors = data[1];
        this.tutors.forEach(tutor => {
          tutor.fullName = tutor.firstName + " " + tutor.lastName;
        });
        this.allLearners = data[2];
        this.providerList = data[3]
        resolve('')
      })
    })
  }

  getProgrammeDetail(id) {
    this.programmeService.getProgrammeDetails(id).subscribe(programme => {
      programme.providerName = this.providerList.filter(data => data.id === programme.providerId)[0].providerName
      this.programmeDetails = programme
    })

  }
  onPanelOpened(index: number) {
    this.enrolledLearners.forEach((panel, i) => {
      if (i === index) {
        panel.isExpanded = true;
      }
    });
  }

  onPanelClosed(index: number) {
    this.enrolledLearners.forEach((panel, i) => {
      if (i === index) {
        panel.isExpanded = false;
      }
    });

  }
}
