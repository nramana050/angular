import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { PlanV2Service } from '../plan-v2.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { log } from 'console';
import { Observable } from 'rxjs';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from 'angular-calendar';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check' } },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, useStrict: true } }
  ]
})
export class AddReviewComponent implements OnInit {

  @Input() goalsList: any;
  profileUrl;
  fname: any;
  userId: any;
  assessmentTemplateId:any;
  assessmentTemplateUserId:any;
  assessmentName:any;
  reviewType:Observable<any[]>;
  reviewForm: FormGroup;
  ilpAssesment:any
  isGoalAdded:Boolean=true;
  isActionAdded:Boolean=false;
  isCompleate:Boolean=true;
  selectedReviewTypeId: any;
  isActionCompleate:Boolean=true;
  finalReview: any;
  checkStatus=false;
 
  minStartDate: Date;
  constructor(
    private readonly dailogRef: MatDialogRef<AddReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly planService: PlanV2Service,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly learnersService: LearnersService,
    private readonly dialog: MatDialog,
    private fb: FormBuilder
  ) {    
    this.assessmentTemplateUserId=data.assessmentTemplateUserId;
    this.assessmentTemplateId=data.assessmentTemplateId;
 
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu); 
    this.minStartDate = new Date();
  
  }

  ngOnInit(): void {
    this.getassessmentes();
    this.reviewForm = this.fb.group({
      reviewTypeId: [null, [Validators.required]],
      personSupportedThoughts: ['', [Validators.required,Validators.maxLength(500) ]],
      staffThoughtd: ['', [Validators.required,Validators.maxLength(500)]],
      reviewDate: [null,[Validators.required] ],
    });
    this.setTitle();
  }

  setTitle() {
    this._route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.userId = params.id;
      }
    });
  }

  dialogClose(): void {
    this.dailogRef.close();
  }

  getassessmentes(){
    this.planService.getReviewType().subscribe(data => {
      this.reviewType = data;
      console.log(this.reviewType,"review");
    })
  }

  onSubmit(): void {
    const payload = this.reviewForm.getRawValue();
    payload.reviewDate =Utility.transformDateToString(payload.reviewDate);
    payload.assessmentTemplateUserId=this.assessmentTemplateUserId
    this.planService.saveReview(payload).subscribe(data=>{
      this._router.navigate([this.profileUrl + '/plan-v2/add-goals'], { queryParams: { id: this.userId, name: this.fname,assessmentTemplateId :this.assessmentTemplateId,assessmentTemplateUserId:this.assessmentTemplateUserId } });
      this.dailogRef.close();
    }) 
  }

  feedBackForm(){
    let reviewType= this.reviewForm.get('reviewTypeId').value;
    this._router.navigate([this.profileUrl + '/plan-v2/feedback-form'], { queryParams: { id: this.userId, name: this.fname,assessmentTemplateId :this.assessmentTemplateId,assessmentTemplateUserId:this.assessmentTemplateUserId,reviewType:reviewType } });
    this.dailogRef.close();
  }

  onOptionSelectd(event)
  { 
     this.isCompleate=true
     this.isAction=false;
    if (event.id === 3) {
    this.fetchGoalsAndAction(this.assessmentTemplateUserId,event);
    }
    else{
      this.isAction=true
    }
  }
  isAction :Boolean=false;
 
  fetchGoalsAndAction(assessmentTemplateUserId: any, review: any) {
    this.planService.getAllGoalsActionByAssessmentTemplateUserId(assessmentTemplateUserId).subscribe(data => {
        data.forEach(goal => {
          if (goal.isGoalEditable == true) {
            this.isCompleate = false;
          }
        })
    });
  
  }
  
  addGoals() {
    this._router.navigate([this.profileUrl + '/plan-v2/add-goals'], { queryParams: { id: this.userId, name: this.fname,assessmentTemplateId :this.assessmentTemplateId,assessmentTemplateUserId:this.assessmentTemplateUserId } });
    this.dailogRef.close();
  }

}
