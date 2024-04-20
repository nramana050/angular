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
import { AddProviderComponent } from './add-provider/add-provider.component';
import { IProvider } from './provider-setup.interface';
import { ProviderSetupService } from './provider-setup.service';

@Component({
  selector: 'app-provider-setup',
  templateUrl: './provider-setup.component.html',
  styleUrls: ['./provider-setup.component.scss']
})
export class ProviderSetupComponent implements OnInit {

  dataSource = new MatTableDataSource<IProvider>();
  displayedColumns: string[] = ['providerName', 'code', 'actions'];
  sortColumn = 'providerName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly snackBarService: SnackBarService,
    private readonly providerSetupService: ProviderSetupService,
    private readonly dialog: MatDialog,
    private readonly adminNavigation: AdminNavigation,
    private readonly appConfirmService: AppConfirmService) {
    this.inPageNavService.setNavItems(this.adminNavigation.adminSubMenu);
  }

  addProviderDialog() {
    this.resolveUsers(this.filterBy);
    this.dialog.open(AddProviderComponent, {
      data: {},
      panelClass: "dialog-responsive"
    }).afterClosed().subscribe(() => {
      this.resolveUsers(this.filterBy);
    })
  }

  editProviderDialog(id: number) {
    this.resolveUsers(this.filterBy);
    this.dialog.open(AddProviderComponent, {
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

    this.providerSetupService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
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
      title: `Delete provider`,
      message: `Are you sure you want to delete provider?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.providerSetupService.deleteProvider(id).subscribe(Response => {
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

  ngOnDestroy(): any {
    this.inPageNavService.setNavItems(null);
  }

}
