import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SessionsService } from '../shared/services/sessions.service';
import { AdministrationNavigation } from './administration.nav';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnDestroy {
  path;
  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly administrationNavigation: AdministrationNavigation,
    // private readonly sessionService: SessionsService,
    private readonly router :Router) {

      let menuitems=(this.administrationNavigation.administrationPageMenu).menuItems
      for (let index = 0; index < menuitems.length; index++) {
        const element = menuitems[index];
      // if(this.isAuthorize(element.featureId)){
      //   this.path=element.state;
      //   break;
      // }
      }
      this.inPageNavService.setNavItems(this.administrationNavigation.administrationPageMenu);
      this.router.navigate([this.path])
    }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  isAuthorize(fid) {
    // return this.sessionService.hasResource([fid.toString()])
  }
}