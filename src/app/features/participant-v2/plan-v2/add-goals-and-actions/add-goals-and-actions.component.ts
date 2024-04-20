import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { PlanV2Service } from '../plan-v2.service';
import { ICourseSetup } from 'src/app/features/admin/course-setup/course-setup.interface';
import { GoalsSetup, YourMainTableRowData } from './goals-actions-setup.component';
import { MatTableDataSource } from '@angular/material/table';
import { AddActionComponent } from '../add-action/add-action.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { I } from '@angular/cdk/keycodes';
import { id } from 'date-fns/locale';

@Component({
  selector: 'app-add-goals-and-actions',
  templateUrl: './add-goals-and-actions.component.html',
  styleUrls: ['./add-goals-and-actions.component.scss']
})
export class AddGoalsAndActionsComponent implements OnInit, OnDestroy {

  profileUrl;
  fname: any;
  userId: number;
  assessmentTemplateId: any;
  assessmentTemplateUserId;
  assessmentUserId;
  assessmentName: any;
  assessmentData: any;
  selectedRating: any;
  ratingId: number;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ["learnerName", 'withdrawalDate']
  coursesColumns: string[] = ['action', 'comment', 'personResponsible', 'status', 'actions'];
  isPanelExpanded: boolean = true;
  withdrawalLearnersData: any[];
  RatingData;
  addGoalForm: FormGroup;
  goalsList: any;
  isNew = true;
  isEdit = false;
  showForm = false;
  showFinalRating = false;
  finalratingId: number;
  selectedFinalRating: any;
  goalID: number;
  goaldata:any;
  goalActivity;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly router: Router,
    private readonly palnv2Service: PlanV2Service,
    private readonly dialog: MatDialog,
    private fb: FormBuilder,
    private readonly snackBarService: SnackBarService
  ) {
     this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.initForm();
    this.setTitle();
    (this._route.snapshot.data as { title: string }).title = `${this.fname}`;
  }

  ngOnInit(): void {
    
    this.getFilterdAssessments();
    this.RatingData = Utility.filterPlanMapByKey("Rating_Scale", "refData_PlanV2");
    this.goalActivity = Utility.filterPlanMapByKey("Goal_Activity_Type","refData_PlanV2");
  }

  initForm() {
    this.addGoalForm = this.fb.group({
      goalDescription: [null, [Validators.required, Validators.maxLength(100)]],
      ratingScaleId: [null, [Validators.required]],
      assessmentTemplateId: [null,[Validators.required]],
      goalActivityTypeId:[null,[Validators.required]],
      userId: [null,],
      markAsComplete:[false],
      markAsInComplete:[false],
      finalratingScaleId: [null],
    });

  }
  
  setTitle() {
    this._route.queryParams.subscribe((params: any) => {
       this.fname = params.name;
      this.userId = +params.id;
      if (params.assessmentTemplateUserId && params.assessmentTemplateUserId) {
        this.assessmentTemplateUserId = +params.assessmentTemplateUserId;
        this.assessmentTemplateId = +params.assessmentTemplateId;
         
      }
      this.getGoalsAndActionList();
    });
  }


  getFilterdAssessments() {
    this.palnv2Service.getFilterdAssessments(this.userId).subscribe(data => {
      this.assessmentData = data;
    })
  }

  setRating(ratingratingScaleId: any): void {
    this.addGoalForm.get('ratingScaleId').setValue(ratingratingScaleId.id);
    this.selectedRating = ratingratingScaleId;
    this.ratingId = ratingratingScaleId.id;
  }

  setFinalRating(finalratingScaleId: any): void {
    this.addGoalForm.get('finalratingScaleId').setValue(finalratingScaleId.id);
    this.selectedFinalRating = finalratingScaleId;
    this.finalratingId = finalratingScaleId.id;
  }

  addAction(goal) {
    const dialogConfig = {
      data: {
        isNew: true,
        goalId: goal.id,
      },
      disableClose: true,
      autoFocus: false,   
    };
    const dialogRef = this.dialog.open(AddActionComponent, dialogConfig).afterClosed().subscribe(() => {
      this.getGoalsAndActionList();
    });
  }

  onSubmit(): void {
    this.isNew ? this.create() : this.update();
  }
 
  create(): void {
    const payload = this.addGoalForm.getRawValue();
    payload.ratingScaleId = this.ratingId;
    payload.userId = this.userId;
    payload.assessmentTemplateUserId = this.assessmentUserId;

      const selectedAssessmentTemplateId = this.addGoalForm.get('assessmentTemplateId').value;
    this.palnv2Service.addgoalDetails(payload).subscribe(
      (response) => {
        this.showForm = false;
        this.snackBarService.success("Goal added successfully");
        this.selectedRating = null;
        this.addGoalForm.reset();
        this.clearFormValidation(this.addGoalForm);
          this.addGoalForm.get('assessmentTemplateId').setValue(selectedAssessmentTemplateId);
        this.getGoalsAndActionList();
        this.openAddActionModal(response.responseObject.id);
      },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    );
  }
  
  clearFormValidation(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control.setErrors(null);
      if (control instanceof FormGroup) {
        this.clearFormValidation(control);
      }
    });
  }
  
  update(): void {
    this.isNew = false
    const planDetails = this.addGoalForm.getRawValue();
    planDetails.id =this.goalID;
    planDetails.ratingScaleId = this.ratingId;
    planDetails.finalratingScaleId = this.finalratingId;
    planDetails.assessmentTemplateUserId = this.assessmentUserId;
    planDetails.userId=this.userId;
    this.palnv2Service.updatePlanGoalDetails(planDetails).subscribe(
      
      (response) => {
        this.addGoalForm.reset();
        this.selectedRating = null;
        this.getGoalsAndActionList();
        this.snackBarService.success("Goal updated successfully");
        this.clearFormValidation(this.addGoalForm);
        this.showForm = false;
      },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    );
  }

  openAddActionModal(goalId: number): void {
    this.showForm = false;
    const dialogConfig = {
      data: {
        isNew: true,
        goalId: goalId,
      },
      disableClose: true,
      autoFocus: false,   
    };
    const dialogRef = this.dialog.open(AddActionComponent, dialogConfig).afterClosed().subscribe(() => { 
      this.getGoalsAndActionList();
    });
  }

  getGoalsData() {
    this.palnv2Service.getGoalsActionByAssessmentTemplateUserId(this.assessmentTemplateUserId).subscribe(data => {
      this.goalsList = data;
    })
  }

  editAction(id) {
    this.showForm = false
    const dialogConfig = {
      data: {
        actionId: + id,
        isNew: false,
      },
      disableClose: true,
      autoFocus: false,
    };
    const dialogRef = this.dialog.open(AddActionComponent, dialogConfig).afterClosed().subscribe(() => {
      this.getGoalsAndActionList();
    });
  }

  editGoal(id) {
    window.scrollTo(0, 0);
    this.isEdit = true;
    this.isNew = false
    this.palnv2Service.getPlanGoalById(id).subscribe(
      (data) => {
        this.addGoalForm.patchValue(data);
        this.goalID = data.id;
        this.selectedRating = data.ratingScaleId;
        this.ratingId = data.ratingScaleId;
        this.finalratingId = data.finalratingScaleId;
        this.addGoalForm.get('assessmentTemplateId').disable();  
        this.goaldata =data;
      },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    );
    this.showForm = true;
  }

  getGoalsAndActionList() {
    if (this.assessmentTemplateId != null && this.assessmentTemplateUserId != null) {
      this.addGoalForm.get('assessmentTemplateId').setValue(this.assessmentTemplateId);
      this.addGoalForm.get('assessmentTemplateId').disable();   
      this.getGoalsData()
    }
    else {
      this.palnv2Service.getGoalSAndActionByServiceUserId(this.userId).subscribe(data => {
        this.goalsList = data;
      })
    }
  }

  selectAssessment(assessment) {
    this.assessmentUserId = assessment.assessmentTemplateUserId;
  }

  goToPlan() {
    this.router.navigate([this.profileUrl + '/plan-v2'], { queryParamsHandling: 'merge' });
  }

  goToGoalsAndActions() {
    this.router.navigate([this.profileUrl + '/plan-v2/add-goals'], { queryParamsHandling: 'merge' });
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
    let urlTree = this.router.parseUrl(this.router.url);
     urlTree.queryParams['assessmentTemplateId'] = null;
     urlTree.queryParams['assessmentTemplateUserId'] = null;
    this.router.navigateByUrl(urlTree);
   }

   canExit(any) {
    return true;
   }

   showAddGoalsForm() {
    this.showForm = true;
    this.addGoalForm.reset();
    this.selectedRating = null;
    this.addGoalForm.get('assessmentTemplateId').setValue(this.assessmentTemplateId);
    if(this.assessmentTemplateUserId==null)
    {
      this.addGoalForm.get('assessmentTemplateId').enable();
    }
    this.isNew = true;
  }

finish(): void {
  this.router.navigate([this.profileUrl + '/plan-v2'], { queryParamsHandling: 'merge' });
}

cancelForm(): void {
  this.addGoalForm.reset();
  this.selectedRating = null;
  this.showForm = false;
}

onMarkAsCompletedClick(value)
{
  this.addGoalForm.get('markAsComplete').setValue(true);
  this.addGoalForm.get('markAsInComplete').setValue(false);
  
}

onMarkAsInCompletedClick(value)
{
  this.addGoalForm.get('markAsComplete').setValue(false);
  this.addGoalForm.get('markAsInComplete').setValue(true);

}

}
