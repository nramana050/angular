import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { PlanV2Service } from '../plan-v2.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddActionComponent implements OnInit {
  profileUrl;
  fname: any;
  userId: any;
  assessmentTemplateId: any;
  assessmentTemplateUserId: any;
  assessmentName: any;
  reviewType: any;
  reviewForm: FormGroup;
  ilpAssesment: any
  actionPerformed;
  goalActivity;
  userList = [];
  addActionForm: FormGroup;
  hideAddGoal: boolean = false;
  editMode: boolean = false; 
  personsupportedAction;
  isNew = false;
  planGoal;
  actionId
  planaction

  constructor(
    private readonly dailogRef: MatDialogRef<AddActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly participantV2Service: PlanV2Service,
    private readonly _route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly manageUsersService: ManageUsersService,
    private readonly snackBarService: SnackBarService,
    private fb: FormBuilder,
  ) 
  {
    if((data.actionId !==null && data.isNew==false))
    {
      this.isNew=true,
      this.actionId=data.actionId;
      this.getGoalsAndActionsDetails(data.actionId);
    } else
    {
      this.planGoal=data.goalId
    }
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
  }
  ngOnInit(): void {
    this.initForm();
    this.getFilterUserList();
    this.mangaePlanRefData();   
}

  initForm() {
    this.addActionForm = this.fb.group({
      actionDescription: [null, [Validators.required, Validators.maxLength(100)]],
      comment: [null, [Validators.required, Validators.maxLength(200)]],
      actionPerformedId: [null,[Validators.required]],
      byWhen: [null,[Validators.required] ],
      byWhoId: [null,[] ],
      markAsComplete:[false],
      markAsInComplete:[false]
    });
  }

  getFilterUserList() {
    this.manageUsersService.getFilterUserList(21).subscribe(data => {
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.userList = data;
    })
  }

  getGoalsAndActionsDetails(Id: number) {
    
    this.participantV2Service.getGoalActionDetails(Id).subscribe(
      (response) => {
        this.planaction=response;
        this.planGoal=response.planGoal; 
        this.addActionForm.patchValue(response)
        //  this.onClickResetActionPerformedId();
      },
      error => {
        this.dailogRef.close();
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

  setTitle() {
    this._route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.userId = +params.id;
      }
    });
  }

  onSubmit(): void {
    this.isNew ?  this.update():this.create() ;
  }
  
  create():void{
    const payload = this.addActionForm.getRawValue();
    payload.userId= this.userId,
    payload.byWhen =Utility.transformDateToString(payload.byWhen);
    payload.planGoal=this.planGoal;
    // this.onClickResetActionPerformedId();
  this.participantV2Service.addPlanGoalActionDetails(payload).subscribe(
    (response) => {   
      this.dailogRef.close();
      this.snackBarService.success("Action added successfully");
    }, error => {
      this.dailogRef.close();
      this.snackBarService.error(error.error.applicationMessage);
    });
  }

  update(): void {
    const planDetails = this.addActionForm.getRawValue();
    planDetails.planGoal=this.planaction.goalId,
    planDetails.id=this.planaction.id;
    planDetails.userId= this.userId,
    planDetails.byWhen =Utility.transformDateToString(planDetails.byWhen);
    this.participantV2Service.updatePlanActionDetails(planDetails).subscribe(
      (response) => {
        this.snackBarService.success("Action Updated successfully");
        this.dailogRef.close();
      }, error => {
        this.dailogRef.close();
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

 mangaePlanRefData() {
  this.personsupportedAction = Utility.filterPlanMapByKey("Action_Performed","refData_PlanV2");
  this.actionPerformed = Utility.filterPlanMapByKey("Action_Performed","refData_PlanV2");
  this.goalActivity = Utility.filterPlanMapByKey("Goal_Activity_Type","refData_PlanV2");
}

onMarkAsCompletedClick(value)
{
  this.addActionForm.get('markAsComplete').setValue(true)
  this.addActionForm.get('markAsInComplete').setValue(false)
}

onMarkAsInCompletedClick(value)
{
  this.addActionForm.get('markAsComplete').setValue(false)
  this.addActionForm.get('markAsInComplete').setValue(true)
}

  onClickResetActionPerformedId(id) {
  let value=  this.addActionForm.get('actionPerformedId').value;
  console.log(value);
  
    // this.addActionForm.get('actionPerformedId').valueChanges.subscribe(value => { 
    //   if (value === 28) {
    //     this.addActionForm.get('byWhoId').clearValidators();
    //   } else {
    //     this.addActionForm.get('byWhoId').setValidators([Validators.required]);
    //   }
    //   this.addActionForm.get('byWhoId').updateValueAndValidity();
    //   if (value !==28) {
    //     this.addActionForm.get('byWhoId').reset();
    //   }
    // });
  }

  

  dialogClose(): void {
    this.dailogRef.close();
  }

  onOptionSelected(event)
  {
    console.log(event);
    
      if (event.value == 28) {
        this.addActionForm.get('byWhoId').clearValidators();
        this.addActionForm.get('byWhoId').setValue(null)
      } else
      {
        this.addActionForm.get('byWhoId').setValue(null)
        this.addActionForm.get('byWhoId').setValidators(Validators.required);
      }
      
  }

}
