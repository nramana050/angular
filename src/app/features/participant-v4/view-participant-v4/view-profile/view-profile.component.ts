import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { ILearners } from 'src/app/features/learners/learners.interface';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ParticipantV4Service } from '../../participant-v4.service';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit ,OnDestroy{

  loggedInUserRole: number;
  user: ILearners;
  fname:string;
  refData;
  isLoaded: boolean = false;
  userList;
  isAuthorized = false;
  allData;
  userId;
  isQualificationSelected: boolean;
  displayedColumns: string[] = ['qualification', 'siteOfQualificationCompletion', 'fullyPartlyCompleted', 'qualificationDateAchived'];
  qualificationsList: any[] = [];
  dataSource: any = new MatTableDataSource<any>();
 
  constructor(
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly learnerService: LearnersService,
    private readonly sessionService: SessionsService,
    private readonly participantV4Service: ParticipantV4Service,


  ) { 
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
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
    this.loggedInUserRole = this.participantV4Service.resolveLoggedInUserRole();
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.resolveUser();
  }

  resolveUser() {
    this.getUserRefDataDetails1();
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.participantV4Service.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.userId = userDetails.primaryLearnerDetails.id;
        this.dataSource=userDetails.qualification 
        if(this.dataSource.length>= 1){
          this.isQualificationSelected = true
        }
         this.isLoaded = true; 
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getUserRefDataDetails1() {
    this.participantV4Service.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    });
    this.participantV4Service.getRefDataAllDetails().subscribe(data => {   
      this.allData = data;
    });
    this.learnerService.getKwList(['TCCSA805','TCCSA3179']).subscribe((data: any) => {
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

