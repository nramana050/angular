import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from '../../framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from '../../framework/service/snack-bar.service';
import { ILearners } from './learners.interface';
import { LearnersService } from './learners.services';


@Component({
  selector: 'app-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss']
})
export class LearnersComponent implements OnInit, AfterViewInit {

  dataSource: any = new MatTableDataSource<ILearners>();
  displayedColumns: string[] = ['fullName', 'NI_Number', 'DateofBirth', 'actions'];
  pageSize = 10;
  filterBy = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('ApplicationID') };
  sortColumn = 'fullName';
  sortDirection = 'asc';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly learnersService: LearnersService,
    private readonly dialog: MatDialog,
    private readonly appConfirmService: AppConfirmService) {
  }

  ngOnInit(): void {
    this.resolveUsers(this.filterBy);

  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveUsers(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveUsers(this.filterBy);
        })
      )
      .subscribe();
  }

  onFilter(filterString: string) {
    this.filterBy.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.resolveUsers(this.filterBy);
  }
  resolveUsers(filterBy) {
    let currentPageIndex = 0;
    if (this.paginator) {
      currentPageIndex = this.paginator.pageIndex;
    }

    this.learnersService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
      .subscribe(allUsersData => {
        this.dataSource = allUsersData.content;
        this.paginator.length = allUsersData.totalElements;
        this.dataSource.sort = this.sort;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onDelete(id) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Learner`,
      message: `Are you sure you want to delete learner?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.learnersService.deleteLearner(id).subscribe(Response => {
          this.snackBarService.success(Response.applicationMessage);
          this.paginator.firstPage();
          this.resolveUsers(this.filterBy);
        }, error => this.snackBarService.error(error.error.applicationMessage)
        );
      }
    });
  }

}

