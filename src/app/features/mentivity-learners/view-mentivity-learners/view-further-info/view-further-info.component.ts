import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { ILearners } from 'src/app/features/learners/learners.interface';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { MentivityService } from '../../mentivity-learners.service';


@Component({
  selector: 'app-view-further-info',
  templateUrl: './view-further-info.component.html',
  styleUrls: ['./view-further-info.component.scss']
})
export class ViewFurtherInfoComponent implements OnInit, OnDestroy {

  loggedInUserRole: number;
  user: ILearners;
  fname:string;
  refData;
  allData;
  isLoaded: boolean = false;
  furtherInfo:any;
  isAuthorized = false;
  profileUrl;

  constructor(
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly mentivityService :MentivityService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly sessionService: SessionsService,
    private readonly learnerNavigation: LearnerNavigation,
  ) {    
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu); 
         this.setTitle();
  }

  ngOnInit(): void {
    this.loggedInUserRole = this.mentivityService.resolveLoggedInUserRole();
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.resolveUser();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  resolveUser() {
    this.getUserRefDataDetails1();
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.mentivityService.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
      this.mentivityService.getFurtherInfo(id).subscribe(userDetails => {
        this.furtherInfo=userDetails;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getUserRefDataDetails1() {
    this.captrLearnersService.getFurtherInfoRefData().subscribe(data => {
      this.refData = data;
    });
    this.mentivityService.getRefDataAllDetails().subscribe(data => {   
      this.allData = data;
    });
  }

  isAuthorize(fid) {
    return this.sessionService.hasResource([fid.toString()])
  }

  Authorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

  
}

