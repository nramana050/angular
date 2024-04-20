import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PrisonJobsService } from '../prison-jobs.service';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { AppConfirmService } from '../../../../framework/components/app-confirm/app-confirm.service';

@Component({
  selector: 'app-view-prison-jobs',
  templateUrl: './view-prison-jobs.component.html',
  styleUrls: ['./view-prison-jobs.component.scss']
})
export class ViewPrisonJobsComponent implements OnInit {
  jobId: any;
  jobData: any = {};
  constructor(
    private readonly prisonJobsService: PrisonJobsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
  ) {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('jobId')) {
        this.jobId = params.jobId;

      }
    });
  }
  ngOnInit() {


    this.prisonJobsService.getPrisonJob(this.jobId).subscribe(data => {
      this.jobData = data;
    });

  }

  onExitClicked() {
    this.router.navigate(['./job-advert/prison-jobs']);
  }


}
