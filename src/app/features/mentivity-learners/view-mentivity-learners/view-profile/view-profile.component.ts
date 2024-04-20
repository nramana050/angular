import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ILearners } from 'src/app/features/learners/learners.interface';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { MentivityService } from '../../mentivity-learners.service';
import { MentivityLearnerNavigation } from '../mentivity-learner-nav';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  
  loggedInUserRole: number;
  user: ILearners;
  fname:string;
  refData;
  isLoaded: boolean = false;
  userList;
  isAuthorized = false;
  allData;
  landingUrl;
  constructor(
    private readonly mentivityService : MentivityService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerService: LearnersService,
    private readonly sessionService: SessionsService,
    private readonly router: Router,
  ) {    
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.getUserRefDataDetails1();

       this.setTitle();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
    this.isAuthorized = false;
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  ngOnInit(): void {
    this.loggedInUserRole = this.mentivityService.resolveLoggedInUserRole();
    // this.isAuthorized = this.sessionService.hasResource(['9','3']);
    console.log(this.landingUrl)
    this.resolveUser();
  }

  async resolveUser() {
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.mentivityService.getUserDetails(id).subscribe(userDetails => {

        this.user = userDetails;
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

   getUserRefDataDetails1() {
    this.mentivityService.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    });
    this.mentivityService.getRefDataAllDetails().subscribe(data => {   
      this.allData = data;
    });
    this.learnerService.getKwList(['CAPTRSA','EUCICCAPTRSA', 'C2CDIGITALCAPTRSA','MNTVSA788','MNTVTYSA2998']).subscribe((data: any) => {
      data.forEach((users: any) => {
        Object.assign(users, { value: users.firstName + ' ' + users.lastName });
      });
      this.userList = data
    });
  }

  isAuthorize(fid) {
    return this.sessionService.hasResource([fid.toString()])
  }


}
