import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ApplicationSetupNavigation } from '../../application-setup-nav';
import { ApplicationSetupService } from '../../application-setup.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-tabs',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

  dataSource :any= [];
  displayedColumns: string[] = ['createdDate', 'createdByName', 'linkName', 'websiteURL', 'tab', 'actions'];
  sortColumn = 'createdByName';
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
    private readonly dialog: MatDialog,
    private readonly applicationSetupNavigation: ApplicationSetupNavigation,
    private readonly applicationSetupService: ApplicationSetupService,
    private readonly sessionService: SessionsService) {
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
    
    this.applicationSetupService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
      .subscribe(resp => {
        this.dataSource = resp.content;
        this.paginator.length = resp.totalElements;
        this.dataSource.sort = this.sort;

        if(this.dataSource.length <= 0){
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

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
}
