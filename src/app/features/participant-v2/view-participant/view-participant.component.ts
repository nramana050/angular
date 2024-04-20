import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParticipantV2Service } from '../participant-v2.service';
import { ActivatedRoute } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ParticipantNavigation } from './participant-nav';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { LearnerNavigation } from '../../captr-learners/view-captr-learner/learner-nav';

@Component({
  selector: 'app-view-participant',
  templateUrl: './view-participant.component.html',
  styleUrls: ['./view-participant.component.scss']
})
export class ViewParticipantComponent implements OnInit,OnDestroy {

  loggedInUserRole: number;

  fname:string;
  refData;
  isLoaded: boolean = false;
  isAuthorized = false;
  user: any;
  userList: any[] = []; 
  displayedColumns1: string[] = ["QualificationTowards", "QualificationStartDate", "DateQualificationAchieved"];
  displayedColumns2: string[] = ['Qualification', 'Level', 'Qualificationstartdate', 'Datequalificationachived'];
  displayedColumns3: string[] = ["QualificationTowards", "QualificationStartDate", "DateQualificationAchieved"];
  
  dataSource = new MatTableDataSource([]);
  achievedQualifications: any[] = [];
  nonAchievedQualifications: any[] = [];
  profileUrl;
  name: any;

  constructor(
    private readonly participantLearnersService: ParticipantV2Service,
    private readonly route: ActivatedRoute,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly snackBarService: SnackBarService,
    private readonly manageUsersService: ManageUsersService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
  }

  ngOnInit(): void {
    
    this.resolveUser();
  }
  
  resolveUser() {
    this.getUserRefDataDetails1();
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.participantLearnersService.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.achievedQualifications = userDetails.towardsQualifications.filter(q => q.achievedDate !== null);
        this.nonAchievedQualifications = userDetails.towardsQualifications.filter(q => q.achievedDate === null);
        
        this.manageDisabilityAndHelthcondtionMaps(userDetails);
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }
  manageDisabilityAndHelthcondtionMaps(userDetails: any) {
    const choices = userDetails.participantV2Details.additionalProgramsMap;
      if (choices) {
       this.user.participantV2Details.additionProgramList=Object.values(choices);
      }
     const disabiltylist= userDetails.disabilityHealth.disabilityChoiceMap;
     if (disabiltylist) {
      this.user.disabilityHealth.disabiltylist=Object.values(disabiltylist);
     }
     const healthconditonslist= userDetails.disabilityHealth.healthConditionChoiceMap;
     if (healthconditonslist) {
      this.user.disabilityHealth.healthconditonslist=Object.values(healthconditonslist);
     }
     const mentalconditionslist= userDetails.disabilityHealth.mentalHealthChoiceMap;
     if (mentalconditionslist) {
      this.user.disabilityHealth.mentalconditionslist=Object.values(mentalconditionslist);
     }
  }
  
  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
    this.isAuthorized = false;
  }
  getUserRefDataDetails1() {
      this.manageUsersService.getFilterUserList(21).subscribe(data => {
        
        data.forEach((users: any) => {
          Object.assign(users, { value: users.firstName + ' ' + users.lastName });
        });
        this.userList = data 
        
         
      })
    
  }


  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }
}
  
  
