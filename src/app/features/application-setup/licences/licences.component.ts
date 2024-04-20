import { Component, OnInit } from '@angular/core';
import { ApplicationSetupNavigation } from '../application-setup-nav';
import { ApplicationSetupService } from '../application-setup.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-licences',
  templateUrl: './licences.component.html',
  styleUrls: ['./licences.component.scss']
})
export class LicencesComponent implements OnInit {

  licencesDetail;
  profileUrl

  constructor(
    private readonly applicationSetupNavigation: ApplicationSetupNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly applicationSetupService: ApplicationSetupService
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

    if(this.profileUrl == 'rws-participant'){
      this.inPageNavService.setNavItems(this.applicationSetupNavigation.appSetupSubMenu2)
    }else{
      this.inPageNavService.setNavItems(this.applicationSetupNavigation.appSetupSubMenu)
    } 
  }

  ngOnInit(): void {
    this.getLicencesDetail();
  }

  getLicencesDetail() {
    this.applicationSetupService.getLicencesDetail().subscribe(resp => {
      this.licencesDetail = resp
    })
  }
  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
