import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { LearnerNavigation } from '../learner-nav';

@Component({
  selector: 'app-job-activity',
  templateUrl: './job-activity.component.html',
  styleUrls: ['./job-activity.component.scss']
})
export class JobActivityComponent implements OnInit {
  userId: string;
  fname: string;
  lname: string;
  SU: string = 'SU';
  favouritesJobs: boolean = false;
  jobApplications: boolean = false;
  prisonJobs: boolean = false;
  localJobs: boolean = false;
  profileUrl;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
        this.setTitle();
        this.jobActivityTabs('localJobs');
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.userId = params.id;
        this.fname = params.name;
        this.userId = params.id;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }
  jobActivityTabs(tabName: string) {
    switch (tabName) {
      case 'favouritesJobs':
        
        this.favouritesJobs = true;
        this.jobApplications = false;
        this.prisonJobs = false;
        this.localJobs = false;
        break;
      case 'jobApllications':
        this.favouritesJobs = false;
        this.jobApplications = true;
        this.prisonJobs = false;
        this.localJobs = false;
        break;
      case 'prisonJobs':
        this.favouritesJobs = false;
        this.jobApplications = false;
        this.prisonJobs = true;
        this.localJobs = false;
        this.router.navigate([this.profileUrl+'/job-activity/prison-jobs'],
      { queryParams: { id: this.userId, firstName: this.fname, lastName: this.lname, SU: this.SU }});

        break;
      case 'localJobs':
        this.favouritesJobs = false;
        this.jobApplications = false;
        this.prisonJobs = false;
        this.localJobs = true;
        break;
    }
  }
  ngOnInit() {
  }

}
