import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InPageNavService } from '../../../framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { AdminNavigation } from '../admin-nav';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { IResourceSetup } from './resource-setup.interface';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ResourceSetupService } from './resource-setup.service';
import { tap } from 'rxjs/operators';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';

@Component({
  selector: 'app-resource-setup',
  templateUrl: './resource-setup.component.html',
  styleUrls: ['./resource-setup.component.scss']
})
export class ResourceSetupComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<IResourceSetup>();
  displayedColumns: string[] = ['resource', 'createdDate', 'actions'];
  sortColumn = 'resource';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly resourceSetupService: ResourceSetupService,
    private readonly inPageNavService: InPageNavService,
    private readonly snackBarService: SnackBarService,
    private readonly dialog: MatDialog,
    private readonly adminNavigation: AdminNavigation,
    private readonly appConfirmService: AppConfirmService) {
    this.inPageNavService.setNavItems(this.adminNavigation.adminSubMenu);
  }

  addResourceDialog() {
    this.resolveUsers(this.filterBy);
    this.dialog.open(AddResourceComponent, {
      data: {},
      panelClass: "dialog-responsive"
    }).afterClosed().subscribe(() => {
      this.resolveUsers(this.filterBy);
    })
  }

  editResourceDialog(id: number) {
    this.resolveUsers(this.filterBy);
    this.dialog.open(AddResourceComponent, {
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

    this.resourceSetupService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
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
      title: `Delete resource`,
      message: `Are you sure you want to delete resource?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.resourceSetupService.deleteResource(id).subscribe(response => {
          this.snackBarService.success(response.message.applicationMessage);
          this.paginator.firstPage();
          this.resolveUsers(this.filterBy)
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