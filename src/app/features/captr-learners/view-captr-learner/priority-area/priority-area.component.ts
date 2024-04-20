import { Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ConfirmService } from '../../../../features/shared/components/confirm-box/confirm-box.service';
import { PlanInductionService } from '../plan-induction/plan-induction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PLAN_INDUCTION_VALIDATION_CONTEXT } from '../plan-induction/plan-induction.validation';
import { AddActionGoalModalComponent } from './add-action-goal-modal/add-action-goal-modal.component';
import { ValidationService } from 'src/app/features/shared/components/form-control/validation.service';
import { NotificationService } from 'src/app/features/shared/components/notification/notification.service';
import { PLAN_INDUCTION_VALIDATION } from '../plan-induction/plan-induction.component';

enum CheckBoxType { completed, inCompleted, NONE };

@Component({
  selector: 'app-priority-area',
  templateUrl: './priority-area.component.html',
  styleUrls: ['./priority-area.component.scss']
})
export class PriorityAreaComponent implements OnInit {
  userAcionInfoForm: FormGroup
  workerList = [] as any;
  isTable: boolean = false;
  goalControl: string
  markAsCompleteControl: string
  markAsInCompleteControl: string
  action: any
  user: any
  date: number
  conversationWithId: any;
  conversationWith: any;
  status: any;
  resetForm: any;
  goalList = [];
  filteredList = [];
  userId: any;
  isEditClicked: boolean = false;
  routeTo: any;
  hideAddGoal: boolean = true;
  isSaveSubmitOperation = false;
  goalId: number;
  markAsComplete: boolean;
  markAsInComplete: boolean;
  actionPlanCreatedFlag = null;
  check = CheckBoxType;
  currentlyChecked: CheckBoxType;
  isEditable: boolean
  actionList: any;
  length: any;
  goalActionId: any;
  actionData: any;
  setAddFlag: boolean =false;
  setEditFlag: boolean =false;
  filteredGoalList: any[];
  hideAction: boolean=false;
  goalData : any;

  @Input() addQuestionName: string;
  @Input() questionId: number;
  @Output() formDirtyEvent = new EventEmitter<any>();

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @ViewChild('addActionModal', { static: false }) addActionGoalModal: AddActionGoalModalComponent;

  

  constructor(
    private readonly validation: ValidationService,
    private readonly confirm: ConfirmService,
    private readonly planInductionService: PlanInductionService,
    private readonly route: ActivatedRoute,
    private readonly notification: NotificationService,
    private readonly router: Router,
    private readonly renderer: Renderer2,
  ) {

    this.validation.setContext(PLAN_INDUCTION_VALIDATION_CONTEXT);
    this.route.queryParams.subscribe((param: any) => {
      if (param.id) {
        this.userId = +param.id;
      }
    })
  }

  ngOnInit(): void {
    // this.addQuestionName = "fghjk"
    this.initForm();
    this.fetchGoalList();
    this.isSaveSubmitOperation = false;
    this.checkActionPlanStatus();
  }

  initForm() {
    const group = {}
    this.goalControl = 'goal_' + this.questionId
    this.markAsCompleteControl = 'markAsComplete_' + this.questionId
    this.markAsInCompleteControl = 'markAsInComplete_' + this.questionId

    group[this.goalControl] = new FormControl('');
    group[this.markAsCompleteControl] = new FormControl([false]);
    group[this.markAsInCompleteControl] = new FormControl([false]);

    this.userAcionInfoForm = new FormGroup(group);
  }

  addAction(id) {
    this.setAddFlag=true;
    this.setEditFlag=false
    this.goalId=id;
    this.filteredGoalList=this.goalList.filter(item => item.id === this.goalId);
    this.actionList=this.filteredGoalList[0]?.actionList;
    if(this.actionList?.length >= 5 ){
      this.notification.error(["Maximum of 5 actions per goal"], true);
      this.setFocusToErrorSummary();
    }
    else {
     this.addActionGoalModal.open(id,this.setAddFlag,this.setEditFlag);
    }
  }
  
  editAction(id) {
    this.setAddFlag=false;
    this.setEditFlag=true;
    this.goalActionId=id;
    this.addActionGoalModal.open(id,this.setAddFlag,this.setEditFlag);
  }

  fetchGoalList() {
    this.planInductionService.getActionPlanGoalList(this.userId).subscribe(data => {

      this.goalList = data.filter(item => item.questionId === this.questionId);
        this.goalList.forEach(goal=>{
        goal.actionList.forEach(actionList=>{
          if (actionList.byWhoId !== this.userId){
            actionList.byWho = actionList.byWho.split(' ')[0]
          }
        })
       })
   });
  }

  closePopUpEvent(){
    this.fetchGoalList();
  }

  onClickAdd() {
    this.setValidators(this.userAcionInfoForm, PLAN_INDUCTION_VALIDATION); 
    if (this.goalList?.length === 2) {
      this.notification.error(["Maximum of 2 goals per area"], true);
      this.setFocusToErrorSummary();
      this.initForm();
    }
    else {
      if (this.userAcionInfoForm.valid) {
        const formattedPayload = this.formatAddGoalPayload();
        this.planInductionService.addGoal(formattedPayload, this.userId).subscribe(result => {
          this.isSaveSubmitOperation = true;
          this.fetchGoalList();
          this.initForm();
          this.clearAllValidatorsAndErrors(this.userAcionInfoForm);
        });
      }
    }
  }

  formatAddGoalPayload() {  
    return {
      "goal": this.userAcionInfoForm.get(this.goalControl).value,
      "id": 0,
      "isSaveAsDraft": false,
      "markAsComplete": false,
      "markAsInComplete": false,
      "planTypeIdentifier": "2",
      "questionDTO":
      {
        "answer": "1",
        "id": this.questionId
      },
      "sectionIdentifier": "57",
      "userId": this.userId,
    }
  }

  onEditClicked(id) {
    this.uncheckAll()
    this.hideAddGoal = false;
    this.planInductionService.getGoalDetails(id, this.userId).subscribe(data => {
      this.goalData = data.goal;
      this.setValidators(this.userAcionInfoForm, PLAN_INDUCTION_VALIDATION);
      this.userAcionInfoForm.get(this.goalControl).setValue(data.goal);
      this.userAcionInfoForm.get(this.markAsCompleteControl).setValue(data.markAsComplete);
      this.userAcionInfoForm.get(this.markAsInCompleteControl).setValue(data.markAsInComplete);
      this.goalId = id;
      this.isEditable = data.isEditable;
      this.hideAction=true;
    })
    setTimeout(() => {
      document.getElementById('id-'+this.goalControl).focus();
    }, 20);
  }

  updateGoal() {
    this.setValidators(this.userAcionInfoForm, PLAN_INDUCTION_VALIDATION);
    if(this.userAcionInfoForm.valid) {
      const payload = this.formatEditGoalPayload(null);
      this.planInductionService.updateGoal(payload, this.userId).subscribe(result => {
        this.fetchGoalList();
        this.initForm();
        this.uncheckAll();
        this.clearAllValidatorsAndErrors(this.userAcionInfoForm);
        this.hideAddGoal = true;
        this.hideAction=false
      }, error => {
        this.notification.error([error.error.applicationMessage], true); 
      })}else {
      this.setFocusToErrorSummary();
    }
  }

  formatEditGoalPayload(id) {
    return {
      "goal": this.userAcionInfoForm.get(this.goalControl).value,
      "id": this.goalId,
      "isSaveAsDraft": false,
      "markAsComplete": this.userAcionInfoForm.get(this.markAsCompleteControl).value,
      "markAsInComplete": this.userAcionInfoForm.get(this.markAsInCompleteControl).value,
      "planTypeIdentifier": "2",
      "questionDTO":
      {
        "answer": "1",
        "id": this.questionId
      },
      "sectionIdentifier": "57",
      "userId": this.userId,
    }
  }

  setValidators(form: FormGroup, validators: any): void {
    Object.keys(form.controls).forEach(name => {
      if (validators[name]) {
        const control = form.get(name);
        if (control) {
          control.setValidators(validators[name]);
          control.updateValueAndValidity();
          control.markAsTouched();
        }
      }
    });
  }

  checkActionPlanStatus() {
    const planTypeIdentifier = "2";
    this.planInductionService.checkCarePlanStatus(this.userId, planTypeIdentifier).subscribe(result => {
      this.actionPlanCreatedFlag = result.isMainPlanAgree;
    })
  }

  edit(id) {
    this.isEditClicked = true;
    this.router.navigate([this.routeTo], { queryParams: { id: id }, relativeTo: this.route });
  }

  isFormDirty(value){
    let formData = {
      userForm : this.userAcionInfoForm,
      isValueChange : value == this.goalData ? false : true
    }
    this.formDirtyEvent.emit(formData);
  }

  canDeactivate() {
    if (this.userAcionInfoForm.dirty && !this.isSaveSubmitOperation) {
      this.confirm.confirm({
        header: 'Progress not saved',
        message: 'Please save your progress before exiting the action plan',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: () => {
          this.confirm.choose(false);
        },
        reject: () => {
          this.confirm.choose(true);
        }
      });
      window.scrollTo(0, 0);
      return this.confirm.navigateSelection;
    }
    return true;
  }

  clearAllValidatorsAndErrors(form: FormGroup): void {
    Object.keys(form.controls).forEach(name => {
      const control = form.get(name);
      control.clearValidators();
      control.setErrors(null);
      control.markAsTouched();
    });
  }

  setFocusToErrorSummary() {
    setTimeout(() => {
      const errorSummary = this.renderer.selectRootElement('.error-summary', true);
      errorSummary.focus();
    })
  }

  checkboxHandler(event, targetType: CheckBoxType) {
    var group_=(el,callback)=>{
      el.forEach((checkbox)=>{
         callback(checkbox)
       })
     }
     group_(document.getElementsByName('checkbox'),(item)=>{
       item.onclick=(e)=>{
           group_(document.getElementsByName('checkbox'),(item)=>{
             item.checked=false;
           })
             e.target.checked=true;
        }
     })
    if (event.target.id === "id-"+this.markAsCompleteControl) {
      this.userAcionInfoForm.get(this.markAsCompleteControl).setValue(true);
      this.userAcionInfoForm.get(this.markAsInCompleteControl).setValue(false);
    }
    else {
      this.userAcionInfoForm.get(this.markAsCompleteControl).setValue(false);
      this.userAcionInfoForm.get(this.markAsInCompleteControl).setValue(true);
    }
    if (this.currentlyChecked === targetType) {
      this.currentlyChecked = CheckBoxType.NONE;
      return;
    }
    this.currentlyChecked = targetType;
  }

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }
}
