import { MatSort } from '@angular/material/sort';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ApplicationSetupNavigation } from '../application-setup-nav';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ApplicationSetupService } from '../application-setup.service';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RoleCreationService } from './role-creation.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { Utility } from 'src/app/framework/utils/utility';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-role-creation',
  templateUrl: './role-creation.component.html',
  styleUrls: ['./role-creation.component.scss']
})
export class RoleCreationComponent implements OnInit, OnDestroy {

  dataSource :any= [];
  displayedColumns: string[] = ['r.roleName', 'r.createdDate', 'r.createdByName', 'allocatedUsers','actions'];
  sortColumn = 'r.createdByName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  showDetails = true;
  profileUrl
  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly snackBarService: SnackBarService,
    private readonly applicationSetupNavigation: ApplicationSetupNavigation,
    private readonly applicationSetupService: ApplicationSetupService,
    private readonly router: Router,
    private readonly roleCreationService: RoleCreationService,
    private readonly appConfirmService: AppConfirmService,
    private readonly sessionService: SessionsService
    ) {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

      if(this.profileUrl == 'rws-participant'){
        this.inPageNavService.setNavItems(this.applicationSetupNavigation.appSetupSubMenu2)
      }else{
        this.inPageNavService.setNavItems(this.applicationSetupNavigation.appSetupSubMenu)
      } 
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

    this.applicationSetupService.findAllPaginatedRoles(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
      .subscribe(resp => {
        this.dataSource = resp.content;
        this.paginator.length = resp.totalElements;
        this.dataSource.sort = this.sort;

        if (this.dataSource.length <= 0) {
          document.getElementsByClassName('learners')[0]['style'].display = 'none';
          this.showDetails = false;
        }
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
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

  onEditClick(id: number) {
    this.router.navigate([`/application-setup/role-creation/add-roles`], { queryParamsHandling: 'merge', queryParams: { id: id } });
  }

  onViewClick(id: number) {
    this.router.navigate([`/application-setup/role-creation/view-role`], { queryParamsHandling: 'merge', queryParams: { id: id } });
  }

  onDelete(roleId) {
    const role = Utility.getObjectFromArrayByKeyAndValue(this.dataSource, 'roleId', roleId)

    const dialogRef = this.appConfirmService.confirm({
      title: `Delete role`,
      message: `Are you sure you want to delete this role?`,

    });
    dialogRef.subscribe(result => {
      if (result) {
        if (role.allocatedUsers && role.allocatedUsers > 0) {
          this.notDeletePopup();
        }
        else {
          this.roleCreationService.deleteRole(roleId).subscribe(response => {
            this.paginator.firstPage();
            this.resolveUsers(this.filterBy);
            this.snackBarService.success(response.applicationMessage);
          }, error => this.snackBarService.error(error.error.applicationMessage)
          );
        }
      }
    });
  }

  notDeletePopup() {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete role`,
      message: `You are unable to delete this role as users are still allocated.
      Remove all users before delete `,
      showOkButtonOnly: true
    });
    dialogRef.subscribe(result => {
      if (result) { }
    });
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
}

