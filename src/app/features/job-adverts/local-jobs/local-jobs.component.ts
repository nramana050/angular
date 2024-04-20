import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job } from '../job';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { LocalJobsService } from './local-jobs.service';
import { tap } from 'rxjs/operators';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { JobAdvertsNavigation } from '../job-adverts.nav';

@Component({
  selector: 'local-jobs',
  templateUrl: './local-jobs.component.html',
  styleUrls: ['./local-jobs.component.scss']
})
export class LocalJobsComponent implements OnInit {


  public items: any[];
  sortColumn = 'jobTitle';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = '';

  authenticatedUserOrgId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId;

  displayedColumns: string[] = ['jobTitle', 'company', 'location.description', 'postingDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Job>();

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _onDeleteConfirmService: AppConfirmService,
    private readonly snackBarService: SnackBarService,
    private readonly snack: MatSnackBar,
    private readonly localJobsService: LocalJobsService,
    private readonly appConfirmService: AppConfirmService,
    private readonly inPageNavService: InPageNavService,
    private readonly jobAdvertsNavigation: JobAdvertsNavigation
  ) {
    this.inPageNavService.setNavItems(this.jobAdvertsNavigation.jobAdvertPageMenu);

   }
  
  resolveLocalJobs(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.localJobsService
      .getAllLocalJobs(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy)
      .subscribe(data => {
        if (data) {
          this.dataSource.data = data.content;
          this.paginator.length = data.totalElements;
        }
      },
        error => {
          this.snackBarService.error(`${error.error.errorMessage}`);
          this.router.navigate(['./job-advert/local-jobs']);
        }
      );
  }

  ngOnInit() {
    this.resolveLocalJobs(this.filterBy);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(data => {
      if(data.active === 'postingDate'){
        this.sortColumn = 'postingDate,createdDate';
      } else {
        this.sortColumn = data.active;
      }
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveLocalJobs(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveLocalJobs(this.filterBy);
          document.querySelector('#local-jobs').scrollIntoView();
        }
        )
      )
      .subscribe();
  }

  onFilter(filterValue: string) {
    this.filterBy = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveLocalJobs(this.filterBy);
  }

  onExitClicked() {
    this.router.navigate(['./job-adverts']);
  }

  onPaginateChange(event) {
    document.querySelector('#local-jobs').scrollIntoView();
  }

  editLocalJob(jobId: any) {
    this.router.navigate(['./edit-local-jobs/', jobId],
      { relativeTo: this.route, queryParams: {} });

  }

  addLocalJobs() {
    this.router.navigate(['./new-local-jobs'],
      { relativeTo: this.route, queryParams: {} });
  }

  viewLocalJob(jobId: any) {
    this.router.navigate(['./view-local-jobs/', jobId],
      { relativeTo: this.route, queryParams: {} });
      
  }

  onDeleteClicked(id) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Job`,
      message: `Are you sure you want to delete this Job?`
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.localJobsService.deleteLocalJob(id).subscribe(
          data => {
            this.resolveLocalJobs(this.filterBy);
            this.snack.open('Local job deleted successfully!', 'Dismiss', { duration: 4000 });
          },
          (error: any) => {
            this.snack.open(error.errorMessage, 'Dismiss', { duration: 6000 });
          }
        );
      }
    });
  }
  //  ngOnDestroy() {
  //   this.inPageNavService.setNavItems(null);
  // }
}
