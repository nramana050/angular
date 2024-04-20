import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Utility } from 'src/app/framework/utils/utility';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { AttendanceService } from '../attendance.service';
import * as moment from 'moment';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-view-attendance-session',
  templateUrl: './view-attendance-session.component.html',
  styleUrls: ['./view-attendance-session.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ViewAttendanceSessionComponent implements OnInit {
  sessionData:any;
  refData:any;
  day;
  displayDate;
  learnerList:any;
  columnsToDisplay = ['Learner Name','Tutor Name', 'Attended'];
  pageSize = 10;
  filterBy = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('ApplicationID') };
  sortColumn = 'fullName';
  sortDirection = 'asc';
  teacherList: any[] = [];
  constructor(
      private readonly route: ActivatedRoute,
      private readonly router: Router,
      private readonly attendanceService: AttendanceService,
      private readonly manageUserService: ManageUsersService

  ) {
      this.route.queryParams.subscribe((params: any) => {
          this.route.snapshot.data['title'] = params['name'] + ' (' + params['sessionName'] + ')';
      });
  }
ngOnInit() {
  this.route.queryParams.subscribe((params: any) => {
    if (params) {
      this.day = params.day;
      const sessionParams = {
        sessionDate: params.day,
        sessionTypeId: params.sessionTypeId,
        programmeCourseDeliveryId: params.pcdId
      }
      const date: moment.Moment = moment(params.day, 'YYYY-MM-DD');
      this.displayDate = date.format('dddd, DD MMMM YYYY');
      let currentPageIndex=0;
      forkJoin([
        this.attendanceService.getLearnersForAttendance(sessionParams),
        this.attendanceService.getAttendanceRefData(),
        this.manageUserService.getAllSuUserByLggedInClient(),
        this.manageUserService.getUserDetailsByRoleIdentifierAndAppId(['CMPLTTR','RMFCMPLTTR'], localStorage.getItem('ApplicationID'))
      ]).subscribe((data: any) => {
        this.sessionData=data[0];
        this.refData=data[1];
        this.learnerList=data[2];
        this.teacherList = data[3]
          this.teacherList.forEach(element => {
          element.fullName = element.firstName + " " + element.lastName;
          })
      })
  }})
  }

  navigateToSessionListPage() {
    this.router.navigate(['/attendance/list'], { queryParams: { day: this.day } });
  }

  getValueById(id, column) {
    let value;
    const learner = Utility.getObjectFromArrayByKeyAndValue(this.learnerList, 'id', id)
    const tutor = Utility.getObjectFromArrayByKeyAndValue(this.teacherList, 'id', id)


    if (learner || tutor) {
      switch (column) {
        case 'NAME':
          value = learner.firstName + " " + learner.lastName;
          break;

        case 'TUTOR':
          value = tutor.fullName;
          break;

          case 'DOB':
            value = learner.dateOfBirth;
            break;
      }

    }
    return value
  }
}
