import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { element } from 'protractor';
import { tap } from 'rxjs/operators';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from '../../../framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { ProgrammeManagmentNavigation } from '../programme-management-nav';
import { ProgrammeDeliveryService } from './programme-delivery.service';

@Component({
  selector: 'app-programme-delivery',
  templateUrl: './programme-delivery.component.html',
  styleUrls: ['./programme-delivery.component.scss']
})

export class ProgrammeDeliveryComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['programmeName', 'providerName','providerCode', 'numberOfCourses', 'numberOfQualifications', 'deliveryNumber', 'action'];
  sortColumn = 'programmeName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ProgrammeDeliveryService: any;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly programmeManagmentNavigation: ProgrammeManagmentNavigation,
    private readonly appConfirmService: AppConfirmService,
    private readonly programmeDeliveryService: ProgrammeDeliveryService
    ) {
    this.inPageNavService.setNavItems(this.programmeManagmentNavigation.programmeManagmentSubMenu);
  }

  ngOnInit(): void {
    this.resolveProgrammeDeliveries(this.filterBy);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveProgrammeDeliveries(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveProgrammeDeliveries(this.filterBy);
        })
      )
      .subscribe();
  }

  resolveProgrammeDeliveries(filterBy) {
    let currentPageIndex = 0;
    if (this.paginator) {
      currentPageIndex = this.paginator.pageIndex;
    }

    this.programmeDeliveryService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
      .subscribe(resp => {
        this.dataSource = resp.content;
        this.paginator.length = resp.totalElements;
        this.dataSource.sort = this.sort;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      });

  }
  resolveUsers(filterBy) {
    let currentPageIndex = 0;
    if (this.paginator) {
      currentPageIndex = this.paginator.pageIndex;
    }

    this.ProgrammeDeliveryService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
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
      title: `Delete programme delivery`,
      message: `Are you sure you want to delete this delivery?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.programmeDeliveryService.deleteProgramDelivery(id).subscribe(response => {
          this.snackBarService.success(response.message.applicationMessage);
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
    this.resolveProgrammeDeliveries(this.filterBy);
  }
}
