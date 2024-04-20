import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import {  MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-job-applications',
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.scss']
})
export class JobApplicationsComponent implements OnInit {
  displayedColumns: string[] = ['applicationStatusDate', 'jobStatus', 'jobTitle', 'jobApplicationStatus.statusDescription'];
  dataSource = new MatTableDataSource<any>();
  authenticatedUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;

  page: number = 0;
  pageSize: number = 10;
  sortDireAndColumn: any = 'applicationStatusDate,desc';
  totalItems: number = 0;
  jobId: string;
  userId: string;
  fname: string;
  lname: string;
  prn: string;
  serviceUser: any;
  flag: boolean = true;
  profileUrl;

  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;

  constructor(private readonly learnersService: LearnersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
  ) { 
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
   }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.fname = params.firstName;
      this.userId = params.id; 
    });
    this.resolveUsersJobApplications();
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe((data)=>{
      this.sortDireAndColumn = `${data.active},${data.direction}`;
      this.paginator.pageIndex = 0;
      this.resolveUsersJobApplications();
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveUsersJobApplications();
          document.querySelector('#applications').scrollIntoView();
        })
      )
      .subscribe();
  }
  resolveUsersJobApplications() {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.learnersService.getJobApplications(this.userId, currentPageIndex, this.pageSize, this.sortDireAndColumn)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.paginator.length = data.totalElements;
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
        this.router.navigate(['./job-applications']);
      });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl]);
  }

  viewApplication(userId: any, applicationId: any) {
    this.learnersService.getServiceUserDetails(userId)
      .subscribe(info => {
        this.serviceUser = info.firstName + ' ' + info.surName + '-' + info.prn;
        this.router.navigate([this.profileUrl + '/job-activity/job-applications/view-application/', applicationId],
          { relativeTo: this.route, queryParams: { firstName:info.firstName, lastName:info.surName, prn:info.prn, id: userId } });
      });

  }
  onPaginateChange(event) {
    document.querySelector('#applications').scrollIntoView();
  }
}
