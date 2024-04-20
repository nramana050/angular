import { Component, OnDestroy } from '@angular/core';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
@Component({
  selector: 'app-job-adverts',
  templateUrl: './job-adverts.component.html',
  styleUrls: ['./job-adverts.component.scss']
})
export class JobAdvertsComponent implements OnDestroy {

  constructor(
    private readonly inPageNavService: InPageNavService,
  ) {
    this.inPageNavService.setNavItems(null);

  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

}
