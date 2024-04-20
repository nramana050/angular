import { Component, OnDestroy, OnInit } from '@angular/core';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ActivatedRoute } from '@angular/router';
import { SrmService } from 'src/app/features/srm/srm.service';
import { forkJoin } from 'rxjs';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { ReferralService } from 'src/app/features/captr-learners/view-captr-learner/referral/referral.service';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { ParticipantV4Service } from '../../../participant-v4.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';

@Component({
  selector: 'app-view-referral',
  templateUrl: './view-referral.component.html',
  styleUrls: ['./view-referral.component.scss']
})
export class ViewReferralComponent implements OnInit,OnDestroy {

  name: any;
  userId: any;
  referralData: any;
  workerList: any[] = [];
  referralList: any[] = [];
  organisationList: any[] = [];
  outcomeList: any[] = [];
  profileUrl;
  allData;


  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly route: ActivatedRoute,
    private readonly participantV4Service: ParticipantV4Service,
    private readonly srmService: SrmService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly manageUsersService :ManageUsersService
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu1);
    this.participantV4Service.getRefDataAllDetails().subscribe(data => {
      this.allData = data;        
    })
    this.setTitle();
   
  }

  ngOnInit(): void {
    this.resolveRefData();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  resolveReferral(referralId) {    
    this.participantV4Service.editReferral(referralId).subscribe(data => {
      this.referralData = data;
    })
    
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      this.route.snapshot.data.title = `${this.name}`;
      this.resolveReferral(params.referralId);

    });
  }

  resolveRefData() {
    forkJoin([
      this.participantV4Service.getReferralDropdownList(),
      this.manageUsersService.getFilterUserList(16),
      this.participantV4Service.getOrganisationDropdownList(),
      this.participantV4Service.getRefOutcomeData()
    ]).subscribe((data: any) => {

      this.referralList = data[0],      
        data[1].forEach((users: any) => {
          users.userFullName = users.firstName + ' ' + users.lastName
        });
      this.workerList = data[1];
      this.organisationList = data[2];
      this.outcomeList = data[3];
    });
  }

  fundingTypeSelect() {
    const id = this.referralData?.fundingDetails.fundingType;
    switch (id) {
      case 919:
        return 1; // other
      case 918:
        return 2; // further education
      case 917:
        return 3; // employment
      case 916:
        return 4; // probation
      case 915:
        return 5; // mental health
      case 914:
        return 6; // medical/physical health
      case 913:
        return 7; // misuse
      case 912:
        return 8; // finance
      case 911:
        return 9; // housing
      default:
        return null;
    } 
  }

}


