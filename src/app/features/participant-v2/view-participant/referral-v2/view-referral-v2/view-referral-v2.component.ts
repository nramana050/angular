import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { ReferralService } from 'src/app/features/captr-learners/view-captr-learner/referral/referral.service';
import { SrmService } from 'src/app/features/srm/srm.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-view-referral-v2',
  templateUrl: './view-referral-v2.component.html',
  styleUrls: ['./view-referral-v2.component.scss']
})
export class ViewReferralV2Component  implements OnInit, OnDestroy {
  name: any;
  userId: any;
  referralData: any;
  workerList: any[] = [];
  activityList: any[] = [];
  organisationList: any[] = [];
  outcomeList: any[] = [];
  
  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly referrralService: ReferralService,
    private readonly srmService: SrmService,
  ) {
   
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
      this.srmService.getKwList(['CAPTRSA', 'EUCICCAPTRSA','C2CDIGITALCAPTRSA']),
      this.referrralService.getOrganisationDropdownList(),
      this.referrralService.getRefOutcomeData()
    ]).subscribe((data: any) => {
        data[0].forEach((users: any) => {
          users.userFullName = users.firstName + ' ' + users.lastName
        });
      this.workerList = data[0];
      this.organisationList = data[1];
      this.outcomeList = data[2];
    });

    let caseNoteActivites = Utility.filterMapByKey("Case_Note_Activity");
    this.activityList = caseNoteActivites.filter(ref => ref.identifier !== 'AFH')
  }

}
