import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from './application.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { IApplication } from './application';
import { tap } from 'rxjs/operators';
import { AppConfirmService } from '../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../framework/service/snack-bar.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  public items: any[];
  sortColumn = 'applicationStatusDate';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' };
  serviceUser: any;
 
  authenticatedUserOrgId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId;

  displayedColumns: string[] = ['applicationStatusDate', 'name', 'jobStatus', 'jobTitle', 'earliestReleaseDate', 'jobApplicationStatus.statusDescription', 'actions'];
  dataSource = new MatTableDataSource<IApplication>();

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _onDeleteConfirmService: AppConfirmService,
    private readonly snackBarService: SnackBarService,
    private readonly snack: MatSnackBar,
    private readonly applicationService: ApplicationService
  ) { }

  resolveApplications(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.applicationService
      .getApplications(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.paginator.length = data.totalElements;
      },
        error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
          this.router.navigate(['./manage-applications']);
        }
      );
  }

  viewApplication(userId: any, applicationId: any) {
    this.applicationService.getServiceUserDetails(userId)
      .subscribe(info => {
        this.serviceUser = info.firstName+ ' ' + info.lastName;
        this.router.navigate(['./view-application/', applicationId],
          { relativeTo: this.route, queryParams: { serviceUser: this.serviceUser } });
      });

  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.serviceUser = params.firstName+ ' ' + params.lastName;
      }
      this.route.snapshot.data['title'] = `${this.serviceUser}`;
    });
    this.resolveApplications(this.filterBy);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(data => {
      if (data.active.indexOf('earliestReleaseDate') === 0) {
        return;
      }
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveApplications(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveApplications(this.filterBy);
          document.querySelector('#applications').scrollIntoView();
        }
        )
      )
      .subscribe();
  }

  onFilter(filterValue: string) {
    this.filterBy.keyword = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveApplications(this.filterBy);

  }

  onExitClicked() {
    this.router.navigate(['./mentivity-learner']);
  }

  onPaginateChange(event) {
    document.querySelector('#applications').scrollIntoView();
  }
}
