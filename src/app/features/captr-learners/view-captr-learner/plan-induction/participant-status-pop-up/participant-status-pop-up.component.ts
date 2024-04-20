import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { AppConfirmService } from '../../../../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../../../../framework/service/snack-bar.service';


@Component({
  selector: 'app-participant-status-pop-up',
  templateUrl: './participant-status-pop-up.component.html',
  styleUrls: ['./participant-status-pop-up.component.scss']
})
export class ParticipantStatusPopUpComponent implements OnInit {
  chatForm: FormGroup;
  suId: any;
  userStatus: any;
  setStatusName: any;
  userStatusId: number;
  popUpMessage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly appConfirmService: AppConfirmService,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly learnersService: LearnersService,
    private readonly snackBarService: SnackBarService,
    private readonly router: Router,
  ) {
    this.setTitle();
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.suId = params.id;
      }
    });
  }

  ngOnInit(): void {
    this.userStatus = this.data.userStatus;
    this.getStatus();
    this.initForm();
  }

  initForm() {
    this.chatForm = this.fb.group({
      chat: ['', [Validators.required,Validators.minLength(1)]],

    });
  }

  statusChange(message) {
    this.initForm();
    const messageJson = {
      id: 0,
      userId: this.data.id,
      userStatusId: this.userStatusId,
      reason: message?.value,
    }
    if (this.userStatus === 'Inactive') {
      this.showExistingPopup(messageJson);
    }
    else {
      this.saveUserStatus(messageJson);
    }
  }

  saveUserStatus(messageJson) {
    this.learnersService.SaveUserStatus(messageJson).subscribe(res => {
      this.snackBarService.success(res.message.applicationMessage);
      window.location.reload();
      this.router.navigate(['./captr-learner']); 
    },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  private showExistingPopup(messageJson) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Confirm Message`,
      message: `Are you sure you want to activate this participant?`,
      cancelButtonName: 'No',
      okButtonName: 'Yes',
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.saveUserStatus(messageJson)

      }
    });
  }

  getStatus() {
    if (this.userStatus === 'Reactivated' || this.userStatus === 'Active') {
      this.setStatusName = 'Deactivated';
      this.userStatusId = 3;
      this.popUpMessage="Please confirm participant deactivation. You must put a reason in the box below."
    }
    else if (this.userStatus === 'Deactivated') {
      this.setStatusName = 'Reactivated';
      this.userStatusId = 4;
      this.popUpMessage= "Please confirm participant reactivation. You must put a reason in the box below."
    }
    else {
      this.setStatusName = 'Activate';
      this.userStatusId = 2;
      this.popUpMessage= "Please confirm participant activation.";
    }
  }
}
