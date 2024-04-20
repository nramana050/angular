import { Component, OnInit, OnDestroy } from '@angular/core';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ActivatedRoute } from '@angular/router';
import { SrmService } from 'src/app/features/srm/srm.service';
import { forkJoin } from 'rxjs';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { ReferralService } from 'src/app/features/captr-learners/view-captr-learner/referral/referral.service';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-view-referral',
  templateUrl: './view-referral.component.html',
  styleUrls: ['./view-referral.component.scss']
})
export class ViewReferralComponent implements OnInit, OnDestroy {
  name: any;
  userId: any;
  referralData: any;
  workerList: any[] = [];
  referralList: any[] = [];
  organisationList: any[] = [];
  outcomeList: any[] = [];
  profileUrl;


  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly route: ActivatedRoute,
    private readonly referrralService: ReferralService,
    private readonly srmService: SrmService,
    private readonly learnerNavigation: LearnerNavigation,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu1);
    this.setTitle();
  }

  ngOnInit(): void {
    this.resolveRefData();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  resolveReferral(referralId) {
    this.referrralService.editReferral(referralId).subscribe(data => {
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
      this.referrralService.getReferralDropdownList(),
      this.srmService.getKwList(['CAPTRSA', 'EUCICCAPTRSA','C2CDIGITALCAPTRSA','MNTVSA788','MNTVTYSA2998']),
      this.referrralService.getOrganisationDropdownList(),
      this.referrralService.getRefOutcomeData()
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

}

