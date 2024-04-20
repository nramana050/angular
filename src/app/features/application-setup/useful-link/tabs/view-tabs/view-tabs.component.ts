import { Component, OnDestroy, OnInit } from '@angular/core';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { TabsService } from '../tabs.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ApplicationSetupNavigation } from '../../../application-setup-nav';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTabsComponent } from '../add-tabs/add-tabs.component';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-view-tabs',
  templateUrl: './view-tabs.component.html',
  styleUrls: ['./view-tabs.component.scss']
})
export class ViewTabsComponent implements OnInit, OnDestroy{

  tabId;
  tabsData;
  profileUrl

  constructor(
    private readonly learnerService: LearnersService,
    private readonly tabservice: TabsService,
    private readonly inPageNavService: InPageNavService,
    private readonly appSetupNavigation: ApplicationSetupNavigation,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

    if(this.profileUrl == 'rws-participant'){
      this.inPageNavService.setNavItems(this.appSetupNavigation.appSetupSubMenu2)
    }else{
      this.inPageNavService.setNavItems(this.appSetupNavigation.appSetupSubMenu)
    } 
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.tabId = params.id
    });
    this.tabservice.getTabsAndLinksDetails(this.tabId).subscribe(res => {
      this.tabsData = res;
    })

  }

  editTabsDialog() {
    this.dialog.open(AddTabsComponent, {
      data: { id: this.tabId },
      panelClass: "dialog-responsive"
    })
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

}
