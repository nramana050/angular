import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ApplicationSetupNavigation } from '../../application-setup-nav';
import { TabsService } from '../tabs/tabs.service'
import { MatDialog } from '@angular/material/dialog';
import { AddTabsComponent } from './add-tabs/add-tabs.component';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  displayedColumns: string[] = ['dateAdded', 'addedBy', 'tabName', 'associated', 'actions'];
  dataSource = new MatTableDataSource();
  sortDirection = 'asc';
  pageSize = 10;
  profileUrl

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly appSetupNavigation: ApplicationSetupNavigation,
    private readonly tabsService: TabsService,
    private readonly dialog: MatDialog,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
    private readonly sessionService: SessionsService

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

      if(this.profileUrl == 'rws-participant'){
        this.inPageNavService.setNavItems(this.appSetupNavigation.appSetupSubMenu2)
      }else{
        this.inPageNavService.setNavItems(this.appSetupNavigation.appSetupSubMenu)
      }  
      }

  ngOnInit(): void {
    this.resolvetabs()
  }
  resolvetabs() {
    this.tabsService.getAllTabs().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    })
  }
  
  addProviderDialog() {
    this.resolvetabs()
    this.dialog.open(AddTabsComponent, {
      data: {},
      panelClass: "dialog-responsive"
    }).afterClosed().subscribe(() => {
      this.resolvetabs();
    })
  }

  editTabsDialog(id: number) {
    this.resolvetabs();
    this.dialog.open(AddTabsComponent, {
      data: { id: id },
      panelClass: "dialog-responsive"
    }).afterClosed().subscribe(() => {
      this.resolvetabs();
    })
  }

  onDeleteTab(id: number) {

    const dialogRef = this.appConfirmService.confirm({
      title: `Delete tab`,
      message: `Are you sure you want to delete this tab?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.tabsService.onDeleteTab(id).subscribe(response => {
          this.snackBarService.success(response.applicationMessage);
          this.resolvetabs()
        }, error => this.snackBarService.error(error.error.applicationMessage)
        );
      }
    })
  
  }
  
  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
}


