import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { TrackTabService } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-timeline-system-interaction-v2',
  templateUrl: './timeline-system-interaction-v2.component.html',
  styleUrls: ['./timeline-system-interaction-v2.component.scss']
})
export class TimelineSystemInteractionV2Component implements OnInit {

  userId: any; 
  @Input() fStructureData: any;
  @Input() loadMoreVisible: boolean;
  @Output() loadMore = new EventEmitter();
  @Input() entryData: any;

  activityRefData: any;
  serviceUserId: number;
  isAuthorized = false;
  profileUrl;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    public  dialog: MatDialog,
    private readonly trackTabService: TrackTabService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.setTitle();
   }

   ngOnInit() {
    this.resolveServiceUserId();
    this.resolveActivityRefData();
   
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.userId = params.id;
      this.route.snapshot.data.title = `${params.name}`;
    });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  resolveServiceUserId() {
    this.route.queryParams.subscribe(params => {
      this.serviceUserId = parseInt(params['id']);
    });
  }

  resolveActivityRefData() {
    this.trackTabService.getActivityRefData().subscribe(data => {
      this.activityRefData = data;
    })
  }

  onClickLoadMore() {
    this.loadMore.emit();
  }

  shouldShowTodayLineBrackets(i) {
    if (i  < this.fStructureData.length - 1) {
      if (this.fStructureData[i + 1].entryDateUnix === this.fStructureData[i].entryDateUnix) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  getActivityId(activityName) {
    if (this.activityRefData) {
      return this.activityRefData.activityList.filter(activity => activity.name === activityName)[0].id
    } else {
      return undefined
    }
  }

}
