import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
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
  selector: 'app-local-jobs',
  templateUrl: './local-jobs.component.html',
  styleUrls: ['./local-jobs.component.scss']
})
export class LocalJobsComponent implements OnInit {
  page: number = 0;
  pageSize: number = 10;
  sortDireAndColumn: any = 'dateExpressed,desc';
  totalItems: number = 0;
  jobId: string;
  userId: string;
  fullName: string;
  SU: string;
  authenticatedUserOrgId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId;
  displayedColumns: string[] = ['dateExpressed', 'jobAdvertNFN.jobTitle', 'jobAdvertNFN.location.description', 'jobStatus', 'status'];
  dataSource = new MatTableDataSource();
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
      this.fullName = params.name;
      this.SU = params.SU;
      this.userId = params.id;
    });
    this.resolveUserLocalJobs();
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe((data)=>{
      this.sortDireAndColumn = `${data.active},${data.direction}`;
      this.paginator.pageIndex = 0;
      this.resolveUserLocalJobs();
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveUserLocalJobs();
          document.querySelector('#local-jobs').scrollIntoView();
        })
      )
      .subscribe();
  }
  resolveUserLocalJobs() {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.learnersService.getLocalJobs(this.userId, currentPageIndex, this.pageSize, this.sortDireAndColumn)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.paginator.length = data.totalElements;
      }, error => {
        this.snackBarService.error(`${error.error.errorMessage}`);
        this.router.navigate(['./local-jobs']);
      });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }

  viewLocalJob(jobId: any) {
    this.router.navigate([this.profileUrl+'/job-activity/local-jobs/su-view-local-jobs/', jobId],
      { relativeTo: this.route, queryParams: {name:this.fullName, SU:this.SU, id: this.userId } });
  }
  onPaginateChange(event) {
    document.querySelector('#applications').scrollIntoView();
  }
}
