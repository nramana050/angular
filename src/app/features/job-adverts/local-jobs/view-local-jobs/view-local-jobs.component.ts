import { Component, OnInit, Input } from '@angular/core';
import { LocalJobsService } from '../local-jobs.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { InPageNavService } from '../../../shared/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';

@Component({
  selector: 'su-view-local-jobs',
  templateUrl: './view-local-jobs.component.html',
  styleUrls: ['./view-local-jobs.component.scss']
})
export class ViewNfnJobsComponent implements OnInit {
  jobData: any = {};
  SU : any;
  @Input() jobId: any;
  flag: any =true;
  userId : any = 0;
  constructor(
    private readonly localJobService: LocalJobsService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly inPageNavService: InPageNavService,
  ) {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('jobId')) {
        this.jobId = params.jobId;
      }
    });
    this.route.queryParams.subscribe((params: any) => {
      if(params.hasOwnProperty('id')){
        this.SU = params.SU;
        this.userId = params.id;
        this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      }
    });
  }

  ngOnInit() {
    this.localJobService.getLocalJobForSU(this.jobId,this.userId).subscribe(data => {
      this.jobData = data;
    });
  }
  onExitClicked() {
    this.location.back();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
