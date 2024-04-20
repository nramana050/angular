import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpressionOfInterest } from '../job';
import { tap } from 'rxjs/operators';
import { JobAdvertsNavigation } from '../job-adverts.nav';
import { InPageNavService } from '../../shared/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { LocalJobsService } from '../local-jobs/local-jobs.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';

@Component({
  selector: 'app-ofjobs-expression-of-interest',
  templateUrl: './ofjobs-expression-of-interest.component.html',
  styleUrls: ['./ofjobs-expression-of-interest.component.scss']
})
export class OFJobsExpressionOfInterestComponent implements OnInit {
  sortColumn = 'dateExpressed';
  sortDirection = 'desc';
  pageSize = 10;
  filterBy = '';
  tabActiveflag: any = false;
  displayedColumns: string[] = ['dateExpressed', 'suUserName', 'suName', 'jobStatus', 'jobAdvertNFN.jobTitle', 'jobExpressionStatus.statusDescription', 'actions'];
  dataSource = new MatTableDataSource<ExpressionOfInterest>();
  nationalJobsTab: any = false;
  expressionOfInterestsTab: any = false;

  @ViewChild(MatPaginator , {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort , {static:false}) sort: MatSort;
  constructor(private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly snack: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly localJobsService: LocalJobsService,
    private readonly inPageNavService: InPageNavService,
    private readonly jobAdvertsNavigation: JobAdvertsNavigation,
    private readonly sessionService: SessionsService) {
    
  }



  resolveNFNJobs(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.localJobsService
      .getExpressionOfInterestList(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy)
      .subscribe(data => {
        if (data) {
          this.dataSource.data = data.content;
          this.paginator.length = data.totalElements;
        }
      },
        error => {
          this.snackBarService.error(`${error.error.errorMessage}`);
          this.router.navigate(['./job-advert/offender-friendly-jobs']);
        });
  }

  ngOnInit() {
    this.resolveNFNJobs(this.filterBy);
  }
  onFilter(filterValue: string) {
    this.filterBy = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveNFNJobs(this.filterBy);
  }
  viewOFJExpressionOfInterest(expressInterestNFNId: any, suname: any) {
    this.router.navigate(['view-job', expressInterestNFNId],{ relativeTo: this.route, queryParams: { 'suname': suname } });
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveNFNJobs(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveNFNJobs(this.filterBy);
          document.querySelector('#of-jobs-expressions-of-interest').scrollIntoView();
        }
        )
      )
      .subscribe();
  }

  onPaginateChange(event) {
    document.querySelector('#of-jobs-expressions-of-interest').scrollIntoView();
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
}
