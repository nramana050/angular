import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from '../../../framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { AdminNavigation } from '../admin-nav';
import { AddQualificationComponent } from './add-qualification/add-qualification.component';
import { IQualificationSetup } from './qualification-setup.interface';
import { QualificationSetupService } from './qualification-setup.service';

@Component({
  selector: 'app-qualification-setup',
  templateUrl: './qualification-setup.component.html',
  styleUrls: ['./qualification-setup.component.scss']
})
export class QualificationSetupComponent implements OnInit {

  dataSource = new MatTableDataSource<IQualificationSetup>();
  displayedColumns: string[] = ['qualificationName', 'qualificationCode', 'action'];
  sortColumn = 'qualificationName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly qualificationSetupService: QualificationSetupService,
    private readonly inPageNavService: InPageNavService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly adminNavigation: AdminNavigation,
    private readonly appConfirmService: AppConfirmService) {
    this.inPageNavService.setNavItems(this.adminNavigation.adminSubMenu);
  }

  addQualificationDialog() {
    this.resolveUsers(this.filterBy);
    this.dialog.open(AddQualificationComponent, {
      data: {},
      panelClass: "dialog-responsive"
    }).afterClosed().subscribe(() => {
      this.resolveUsers(this.filterBy);
    })
  }

  editQualificationDialog(id: number) {
    this.resolveUsers(this.filterBy);
    this.dialog.open(AddQualificationComponent, {
      data: { id: id },
      panelClass: "dialog-responsive"
    }).afterClosed().subscribe(() => {
      this.resolveUsers(this.filterBy);
    })
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

    this.qualificationSetupService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
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
      title: `Delete qualification`,
      message: `Are you sure you want to delete qualification?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.qualificationSetupService.deleteQualification(id).subscribe(response => {
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
    this.resolveUsers(this.filterBy);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

}
