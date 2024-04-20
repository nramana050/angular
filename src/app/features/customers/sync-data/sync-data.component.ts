import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { Component, OnInit } from '@angular/core';
import { SyncDataService } from './sync-data.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { CustomersNavigation } from '../customers.nav';


@Component({
  selector: 'app-sync-data',
  templateUrl: './sync-data.component.html',
  styleUrls: ['./sync-data.component.scss']
})
export class SyncDataComponent implements OnInit {

  constructor(private readonly syncDataService: SyncDataService,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly customerNavigation: CustomersNavigation ) {
      this.inPageNavService.setNavItems(this.customerNavigation.CustomersMenu);
    }

  ngOnInit() {
  }

  syncData() {
    this.syncDataService.getAllSyncData().subscribe(
      response => {
        this.snackBarService.success(response.applicationMessage);
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
    });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
