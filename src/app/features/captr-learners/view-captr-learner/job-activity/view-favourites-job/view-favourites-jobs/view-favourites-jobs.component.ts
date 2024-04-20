import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobDetails } from './JobDetails.interface';
import { Location } from '@angular/common';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../../learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-view-favourites-jobs',
  templateUrl: './view-favourites-jobs.component.html',
  styleUrls: ['./view-favourites-jobs.component.scss']
})
export class ViewFavouritesJobsComponent implements OnInit {
  job:JobDetails;
  userId: string;
  fname: string;
  lname: string;
  prn: string;
  profileUrl;

  constructor( private readonly learnersService: LearnersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly location: Location,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,

    ) { 
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.setTitle();
      }
    
    setTitle() {
      this.route.queryParams.subscribe((params: any) => {
        if (params.id) {
          this.fname = params.name;
          }
        this.route.snapshot.data['title'] = `${this.fname}`;
      });
    }
  
    ngOnInit() {
      this.route.queryParams.subscribe((params: any) => {
        if (!params.jobid) {
          this.router.navigate(['../'], { relativeTo: this.route });
        } else {
          this.learnersService.getJobDetails(params.jobid)
          .subscribe(jobDetails => {
            this.job = jobDetails;
            console.log('this.job: ', this.job)
            console.log( this.job.job_title);
          },
          error => {
            this.snackBarService.error(`${error.error.applicationMessage}`);
            this.router.navigate(['../../']);
          });
        }
      });
    }

    ngOnDestroy() {
      this.inPageNavService.setNavItems(null);
    }

    goBack() {
      this.location.back();
    }
  
  }
