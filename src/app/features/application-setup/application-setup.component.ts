import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationSetupNavigation } from './application-setup-nav';
import { InPageNavService } from '../shared/components/in-page-nav/in-page-nav.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Router } from '@angular/router';
// import { SessionsService } from '../shared/services/sessions.service';

@Component({
  selector: 'app-application-setup',
  templateUrl: './application-setup.component.html',
  styleUrls: ['./application-setup.component.scss']
})
export class ApplicationSetupComponent implements OnInit,OnDestroy {

  profileUrl;
  path;
  constructor(
    private readonly inPageNavService:InPageNavService,
    private readonly appSetupNavigation: ApplicationSetupNavigation,
    private readonly router: Router,
    // private readonly sessionService: SessionsService,
  ) {

    let menuitems=(this.appSetupNavigation.appSetupSubMenu).menuItems
    for (let index = 0; index < menuitems.length; index++) {
      const element = menuitems[index];
    // if(this.isAuthorize(element.featureId)){
    //   this.path=element.state;
    //   break;
    //  }
    }

    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

   console.log('rws-participant',this.profileUrl )
    if(this.profileUrl == 'rws-participant'){
      this.inPageNavService.setNavItems(this.appSetupNavigation.appSetupSubMenu2)
    }else{
      this.inPageNavService.setNavItems(this.appSetupNavigation.appSetupSubMenu)
    } 
    this.router.navigate([this.path])
   }

  ngOnInit(): void {
    console.log("asdfbgnhjmfnb")
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  isAuthorize(fid) {
    // return this.sessionService.hasResource([fid.toString()])
  }

}
