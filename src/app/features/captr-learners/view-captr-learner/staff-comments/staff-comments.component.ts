import { Component, OnInit } from '@angular/core';
import { TrackTabService } from '../plan-content-card/track-tab/track-tab.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerNavigation } from '../learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { AddCommentModalComponent } from '../plan-content-card/track-tab/f-structure-modals/add-comment-modal/add-comment-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';

@Component({
  selector: 'app-staff-comments',
  templateUrl: './staff-comments.component.html',
  styleUrls: ['./staff-comments.component.scss']
})
export class StaffCommentsComponent implements OnInit {

  fname: string;
  userId: string;
  profileUrl: string;
  commentRefDataItem: any;
  fStructureData: any[] = [];
  pageNumber: number = 0;
  isAuthorizedAdd: boolean = false;
  isAuthorizedDelete: boolean = false;
  loadMoreVisible: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly trackTabService: TrackTabService,
    private readonly learnersService: LearnersService,
    private readonly sessionService: SessionsService,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
    public dialog: MatDialog,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
   }

  ngOnInit(): void {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.isAuthorizedAdd = this.sessionService.hasResource(['119','1']);
    this.isAuthorizedDelete = this.sessionService.hasResource(['119','4']);
    this.resolveCommentsData();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
      }
      if (params.id) {
        this.userId = params.id;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  resolveCommentsData() {
    this.trackTabService.getActivityRefDataOnly().subscribe(actRefData => {
      this.commentRefDataItem = actRefData.filter(
        (activity: { identifier: string; }) => activity.identifier.trim().substring(0, 3) === 'CMT')[0];
      this.getFstructureComments();
    });
  }

  getFstructureComments() {
    this.learnersService.getFstructureComments(this.userId, this.pageNumber, 'createdDate').subscribe(data => {
      this.fStructureData = data.content;
      this.loadMoreVisible = !data.last;
    });
  }

  openAddCommentModal(): void {
    const dialogRef = this.dialog.open(AddCommentModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '550px',
    });
    dialogRef.afterClosed().subscribe(addCommentPayload => {
      if (addCommentPayload) {
        const formattedPayload = {
          "activityId": this.commentRefDataItem.id,
          "id": 0,
          "notes": addCommentPayload.comment,
          "serviceUserId": this.userId,
        }
        this.trackTabService.createComment(formattedPayload).subscribe(response => {
          this.snackBarService.success(response.message.successMessage.replace(' to track', ''));
          this.pageNumber = 0;
          this.getFstructureComments();
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      }
    });
  }
 
  onClickLoadMore() {
    this.pageNumber += 1;
    this.learnersService.getFstructureComments(this.userId, this.pageNumber, 'createdDate').subscribe(data => {
      this.fStructureData = this.fStructureData.concat(data.content);
      this.loadMoreVisible = !data.last;
    });
  }

  openConfirmDeleteCommentModal(id: number) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Comment`,
      message: `Are you sure you want to delete this comment?`,
      showTextField: false,
      placeholderTextField: ''
    });
    
    dialogRef.subscribe(result => {
      if (result) {
        this.trackTabService.deleteComment(id).subscribe(response => {
          this.snackBarService.success(response.message.successMessage);
          this.pageNumber = 0;
          this.getFstructureComments();
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      }
    });
  }
  
  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }
}
