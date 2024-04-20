import { Component, OnDestroy, OnInit } from '@angular/core';
import { InPageNavService } from '../../framework/components/in-page-nav/in-page-nav.service';
import { AdminNavigation } from './admin-nav';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly adminNav: AdminNavigation
  ) {
    this.inPageNavService.setNavItems(this.adminNav.adminSubMenu);
  }

  ngOnInit() {
    this.inPageNavService.setNavItems(this.adminNav.adminSubMenu);
  }

}
