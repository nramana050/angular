import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantNavigation } from 'src/app/features/participant-v2/view-participant/participant-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../learner-nav';
import { AddJobReadinessComponent } from './add-job-readiness/add-job-readiness.component';
import { JobReadinessService } from './job-readiness.service';
import { Location } from '@angular/common';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { JobReadinessHistoryComponent } from './job-readiness-history/job-readiness-history.component';

@Component({
  selector: 'app-job-readiness',
  templateUrl: './job-readiness.component.html',
  styleUrls: ['./job-readiness.component.scss']
})
export class JobReadinessComponent implements OnInit,OnDestroy {
  data: any;
  isReferralsEmpty = false;
  suId;
  readiness;
  jobReadinessData: any;
  colourId: number;
  id: number;
  profileUrl;
  name: any;
  userId: any;
  versionHistory: boolean;

  readonly CAPTR_URL = 'captr-learner';

  constructor(
    private readonly jobReadinessService: JobReadinessService,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly router: Router,
    private readonly pageNav: InPageNavService,
    private readonly learnerNav: LearnerNavigation,
   
    ) {
  this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.pageNav.setNavItems(this.learnerNav.learnerSubMenu1);
    this.setTitle();
      this.viewReadiness(this.userId);
  }
 

  ngOnInit(): void {
    this.getColours();
  }

  addReadiness() {
    const dialogConfig = {
      data: {
        colourId: this.colourId,
      },
      panelClass: 'dialog-responsive',
    };
  
    const dialogRef = this.dialog.open(AddJobReadinessComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(() => {
      this.viewReadiness(this.userId);
    });
  }
  
  editReadiness() {
    if (this.readiness) {
      const dialogRef = this.dialog.open(AddJobReadinessComponent, {
        data: this.readiness,
        panelClass: 'dialog-responsive'
      });
      dialogRef.afterClosed().subscribe(() => {
        this.viewReadiness(this.userId);
      });
    }
  }
  getColours() {
    this.jobReadinessService.getColours().subscribe(data => {
      this.colourId = data.colourId;
    });
  }

  viewReadiness(id: any) {
    this.jobReadinessService.viewReadiness(id).subscribe(data => {
      this.readiness = data;
      this.versionHistory = data.version > 1;
    })
  }

  showHistory() {
    this.dialog.open(JobReadinessHistoryComponent, {
      data: {
        jrId: this.readiness.id,
        userId: this.readiness.serviceUserId
      }
    });
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.name}`;
    });
  }
  
  onExitClicked() {
    
    this.router.navigate([this.profileUrl+`/participant-professional-view`], { queryParamsHandling: 'merge', queryParams: { id: this.userId } });
  }
  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
