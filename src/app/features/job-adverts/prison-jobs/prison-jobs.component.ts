import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { PrisonJobsService } from './prison-jobs.service';
import { tap } from 'rxjs/operators';
import { Job } from '../job';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';

@Component({
  selector: 'prison-jobs',
  templateUrl: './prison-jobs.component.html',
  styleUrls: ['./prison-jobs.component.scss']
})
export class PrisonJobsComponent implements OnInit {
  
  public items: any[];
  sortColumn = 'jobTitle';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = '';
 
  authenticatedUserOrgId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId;

  displayedColumns: string[] = [ 'jobTitle','location','postingDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Job>();

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _onDeleteConfirmService: AppConfirmService,
    private readonly snackBarService: SnackBarService,
    private readonly snack: MatSnackBar,
    private readonly prisonJobsService: PrisonJobsService,
    private readonly appConfirmService: AppConfirmService
  ) { }

  resolvePrisonJobs(filterBy) {
    this.prisonJobsService
      .getAllPrisonJobs(`${this.sortColumn},${this.sortDirection}`, this.pageSize, this.paginator.pageIndex, filterBy)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.paginator.length = data.totalElements;
      }
        ,
        error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
          this.router.navigate(['./job-advert/prison-jobs']);
        }
      ); 	 
  }	
  
  ngOnInit() {
    this.resolvePrisonJobs(this.filterBy);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolvePrisonJobs(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolvePrisonJobs(this.filterBy);
          document.querySelector('#prison-jobs').scrollIntoView();
        }
        )
      )
      .subscribe();
  }

  onFilter(filterValue: string) {
    this.filterBy = filterValue;
    this.paginator.pageIndex = 0;
    this.resolvePrisonJobs(this.filterBy);
  }
  
  onExitClicked() {
    this.router.navigate(['./job-adverts']);
  }

  onPaginateChange(event) {
    document.querySelector('#prison-jobs').scrollIntoView();
  }

  editPrisonJob(jobId: any) {
    this.router.navigate(['./edit-prison-jobs/', jobId],
          { relativeTo: this.route, queryParams: {  } });
    
  }

  viewPrisonJob(jobId: any) {
    this.router.navigate(['./view-prison-jobs/', jobId],
          { relativeTo: this.route, queryParams: {  } });
    
  }


  addPrisonJobs(){
    this.router.navigate(['./new-prison-jobs'],
          { relativeTo: this.route, queryParams: {  } });
  }

  onDeleteClicked(id) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Job`,
      message: `Are you sure you want to delete this Job?`,
      okButtonName: 'Ok',
      cancelButtonName: 'Cancel'
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.prisonJobsService.deleteLocalJob(id).subscribe(
          data => {
            this.resolvePrisonJobs(this.filterBy);
            this.snack.open('Local job deleted successfully!', 'Dismiss', { duration: 4000 });
          },
          (error: any) => {
            this.snack.open(error.errorMessage, 'Dismiss', { duration: 6000 });
          }
        );
      }
    });
  }
}
