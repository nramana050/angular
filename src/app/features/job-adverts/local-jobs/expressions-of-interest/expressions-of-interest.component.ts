import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobInterested } from '../../job';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalJobsService } from '../local-jobs.service';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';

@Component({
  selector: 'app-expressions-of-interest',
  templateUrl: './expressions-of-interest.component.html',
  styleUrls: ['./expressions-of-interest.component.scss']
})
export class ExpressionsOfInterestComponent implements OnInit {
  sortColumn = 'dateExpressed';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = '';
  displayedColumns: string[] = ['dateExpressed', 'learner','prison'];
  dataSource = new MatTableDataSource<JobInterested>();
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @Input('jobStatus') jobStatus: string;

  constructor(
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly snack: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly localJobsService: LocalJobsService) { 
      this.route.params.subscribe(params => {
        if (params.hasOwnProperty('jobId')) {
          this.filterBy = params.jobId;
        }
      });
    }

  resolveLocalJobs(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.localJobsService
      .getInterestedSUs(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy)
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
    this.dataSource.paginator = this.paginator;

    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;      
      this.resolveLocalJobs(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveLocalJobs(this.filterBy);
          document.querySelector('#expressions-of-interest').scrollIntoView();
        }
        )
      )
      .subscribe();
  }

  onPaginateChange(event) {
    document.querySelector('#expressions-of-interest').scrollIntoView();
  }
}
