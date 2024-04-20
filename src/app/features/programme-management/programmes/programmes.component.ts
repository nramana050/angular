import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from '../../../framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { ProgrammeManagmentNavigation } from '../programme-management-nav';
import { IProgrammes } from './programmes.interface';
import { ProgrammesService } from './programmes.service';

@Component({
  selector: 'app-programmes',
  templateUrl: './programmes.component.html',
  styleUrls: ['./programmes.component.scss']
})
export class ProgrammesComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<IProgrammes>();
  displayedColumns: string[] = ['programmeName', 'programmeProvider','providerCode', 'numberOfCourses', 'numberOfQualifications', 'timesDelivered', 'action'];
  sortColumn = 'programmeName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly programmeService: ProgrammesService,
    private readonly programmeNav: ProgrammeManagmentNavigation,
    private readonly appConfirmService: AppConfirmService) {
    this.inPageNavService.setNavItems(this.programmeNav.programmeManagmentSubMenu);
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

  resolveUsers(filterBy) {
    let currentPageIndex = 0;
    if (this.paginator) {
      currentPageIndex = this.paginator.pageIndex;
    }

    this.programmeService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
      .subscribe(resp => {
        this.dataSource = resp.content;
        this.paginator.length = resp.totalElements;
        this.dataSource.sort = this.sort;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

  onDelete(id) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete programme`,
      message: `Are you sure you want to delete programme?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.programmeService.deleteProgramme(id).subscribe(Response => {
          this.snackBarService.success(Response.message.applicationMessage);
          this.paginator.firstPage();
          this.resolveUsers(this.filterBy);
        }, error => this.snackBarService.error(error.error.applicationMessage)
        );
      }
    });
  }

  onFilter(filterString: string) {
    this.filterBy.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.resolveUsers(this.filterBy);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
