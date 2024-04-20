import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { IUser } from './user.interface';
import { ManageUserV2Service } from './manage-user-v2.service';

@Component({
  selector: 'app-manage-user-v2',
  templateUrl: './manage-user-v2.component.html',
  styleUrls: ['./manage-user-v2.component.scss']
})
export class ManageUserV2Component implements OnInit, AfterViewInit {

  loggedInUserRole: number;

  displayedColumns: string[] = ['fullName', 'userName','region', 'prisonsResponsible', 'accountType', 'accountState', 'actions'];
  dataSource = new MatTableDataSource<IUser>();

  sortColumn = 'fullName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' , 'refUserType': 'SF', appId: localStorage.getItem('ApplicationID')};
  deleteReasonsRefData: any;
  licencesDetail;
  userType = 2

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private readonly manageUserV2Service :ManageUserV2Service,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
    private readonly router: Router
    
  ) { }
  ngOnInit(): void {
    // this.loggedInUserRole = this.manageUsersService.resolveLoggedInUserRole();
    console.log("sadfgdbbfv")
    this.resolveUsers(this.filterBy);
    this.resolveDeleteReasonsRefData();
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

    this.manageUserV2Service.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
      .subscribe(allUsersData => {
        this.dataSource = allUsersData.content;
        this.paginator.length = allUsersData.totalElements;
        this.dataSource.sort = this.sort;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

  onFilter(filterString: string) {
    this.filterBy.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.resolveUsers(this.filterBy);
  }
  resolveDeleteReasonsRefData() {
    this.manageUserV2Service.getDeleteReasonsRefData().subscribe(
      data => this.deleteReasonsRefData = data,
      error => this.snackBarService.error(error.error.applicationMessage)
    );
  }

  onDeleteClicked(elementId) {

    const dialogRef = this.appConfirmService.confirm({
      title: `Delete User`,
      message: `Are you sure you want to delete user?`,
      showTextField: false,
      placeholderTextField: '',
      showSelectField: true,
      placeholderSelectField: `Select a reason for delete`,
      optionsSelectField: this.deleteReasonsRefData
    });

    dialogRef.subscribe(result => {

      if (result) {

        this.manageUserV2Service
          .deleteUser(JSON.stringify({ 'deletionReasonId': result, 'id': elementId })).subscribe(
            response => {
              this.snackBarService.success(`The user is deleted`);
              this.paginator.firstPage();
              this.resolveUsers(this.filterBy);
            },
            error => this.snackBarService.error(error.error.applicationMessage)
          );
      }
    });

  }

  onClickAddUser() {

    this.manageUserV2Service.getValidLicences(this.userType).subscribe(data => {
      if (data.isAuthorisedLicence) {
        this.router.navigateByUrl('v2/manage-users/new-user');
      }
      else {
        this.notAddPopup();
      }

     })
  }

  notAddPopup() {
    const dialogRef = this.appConfirmService.confirm({
      title: `Licences`,
      message: `It appears you have exceeded your user limit for this account. 
      Please contact us on support.mailbox@meganexus.com or 0207 843 4343 `,
      showOkButtonOnly: true,
      padding : '22px'
    });
    dialogRef.subscribe(result => {
      if (result) { }
    });
  }


}
