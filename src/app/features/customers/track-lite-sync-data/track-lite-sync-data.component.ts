import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { TrackLiteSyncDataService } from './track-lite-sync-data.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { CustomersNavigation } from '../customers.nav';

@Component({
  selector: 'app-track-lite-sync-data',
  templateUrl: './track-lite-sync-data.component.html',
  styleUrls: ['./track-lite-sync-data.component.scss']
})
export class TrackLiteSyncDataComponent implements OnInit {

  constructor(
    private readonly trackLiteSyncDataService: TrackLiteSyncDataService,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly customerNavigation: CustomersNavigation ) {
      this.inPageNavService.setNavItems(this.customerNavigation.CustomersMenu);
    }

  ngOnInit() {
  }

  syncData() {
    this.trackLiteSyncDataService.getAllTrackLiteSyncData().subscribe(response => {
      this.snackBarService.success(response.successMessage);
    }, error => {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
