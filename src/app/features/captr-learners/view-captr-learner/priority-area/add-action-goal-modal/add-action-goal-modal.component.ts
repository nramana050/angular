import { Component, ElementRef, Input, OnInit, Output, QueryList, Renderer2, ViewChildren, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { ValidationService } from 'src/app/features/shared/components/form-control/validation.service';
import { NotificationService } from 'src/app/features/shared/components/notification/notification.service';
import { Utility } from 'src/app/framework/utils/utility';
import { PLAN_INDUCTION_VALIDATION } from '../../plan-induction/plan-induction.component';
import { PlanInductionService } from '../../plan-induction/plan-induction.service';
import { PLAN_INDUCTION_VALIDATION_CONTEXT } from '../../plan-induction/plan-induction.validation';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';

enum CheckBoxType { completed, inCompleted, NONE };

@Component({
  selector: 'app-add-action-goal-modal',
  templateUrl: './add-action-goal-modal.component.html',
  styleUrls: ['./add-action-goal-modal.component.scss']
})

export class AddActionGoalModalComponent implements OnInit {
  addActionForm: FormGroup
  workerList = [] as any;
  userList = [];
  goalList = [];
  isTable: boolean = false;
  isSaveSubmitOperation = false;
  addActionControl: string;
  addCommentControl: string
  addByWhoIdControl: string
  addByWhenControl: string
  goalId: number;
  action:string
  who:string
  when:string
  markAsCompleteActionControl: string
  markAsInCompleteActionControl: string
  hideAddGoal: boolean = false;
  isEditable: boolean
  userId: number;
  userPlans: any=[];
  suId: any;
  sectionName: any;
  historySectionName: string;
  _visible: boolean;
  historyList: any;
  filterList: any;
  suList : any;
  actionList: any;
  actionData: boolean;
  actionId: any;
  check = CheckBoxType;
  currentlyChecked: CheckBoxType;

  @Input() questionId: number;
  @Output() closeDialogEvent = new EventEmitter<any>();
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  addByWhoChoiceIdControl: string;
  whoId: number;
  refActionChoiceList: any;
  actionLabel: string;
  choiceId: any;
  @ViewChildren("radioCheck") radioCheck: QueryList<ElementRef>;
  showDropdown =  false;

  constructor(
    private readonly renderer: Renderer2,
    private readonly srmService: LearnersService,
    private readonly planInductionService: PlanInductionService,
    private readonly validation: ValidationService,
    private readonly notification: NotificationService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly manageUsersService: ManageUsersService
  ) {   
      
    this.validation.setContext(PLAN_INDUCTION_VALIDATION_CONTEXT);
    this.route.queryParams.subscribe((param: any) => {
      if (param.id) {
        this.userId = +param.id;
       }
     })
    }

  ngOnInit(): void {
    this.fetchGoalActionList();
    this.initForm();
    this.manageUsersService.getFilterUserList(3).subscribe(data=>{
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.userList = data;
    })
    this.getRefActionChoiceList();
    this.defineAndSetValidators();
  }

  initForm() {
    const Group = {}
    this.addActionControl = 'action_' + this.questionId
    this.addCommentControl = 'comment_' + this.questionId
    this.addByWhoIdControl = 'byWhoId_' + this.questionId
    this.addByWhenControl = 'byWhen_' + this.questionId
    this.markAsCompleteActionControl = 'markAsComplete_' + this.questionId
    this.markAsInCompleteActionControl = 'markAsInComplete_' + this.questionId
    this.addByWhoChoiceIdControl = 'byWhoChoiceId_' + this.questionId

    Group[this.addActionControl] = new FormControl('');
    Group[this.addCommentControl] = new FormControl('');
    Group[this.addByWhoIdControl] = new FormControl('');
    Group[this.addByWhenControl] = new FormControl('');
    Group[this.markAsCompleteActionControl] = new FormControl([false]);
    Group[this.markAsInCompleteActionControl] = new FormControl([false]);
    Group[this.addByWhoChoiceIdControl] = new FormControl('');

    this.addActionForm = new FormGroup(Group);
  }

  open(Id:any,addFlag:boolean,editFlag:boolean) {
    document.getElementById('gds_innerModal').scrollTo(0,0);
    this.goalId = Id;
    this.hideAddGoal=addFlag;
    if(addFlag !== true) {
    this.onEditClicked(Id);
    }
    this.initForm();
    this.visible = true;
  }

  addAction() {
   
    if(this.showDropdown) {
      PLAN_INDUCTION_VALIDATION[this.addByWhoIdControl] = [Validators.required];
    }
    else {
      PLAN_INDUCTION_VALIDATION[this.addByWhoIdControl] = [];
    }
   this.setValidators(this.addActionForm, PLAN_INDUCTION_VALIDATION);
    this.defineAndSetValidators();
      if (this.addActionForm.valid) {
        const formattedPayload = this.formatAddActionPayload();
        this.planInductionService.addAction(formattedPayload).subscribe(result => {
          this.isSaveSubmitOperation = true;
          this.fetchGoalActionList();
          this.initForm();
          this.close();
          this.clearAllValidatorsAndErrors(this.addActionForm);
        });
      } else {
        this.setFocusToErrorSummary();
      }
  }

  formatAddActionPayload() {
    this.getChoice();
    return {
      "id": 0,
      "goalId": this.goalId,
      "action": this.addActionForm.get(this.addActionControl).value,
      "comment": this.addActionForm.get(this.addCommentControl).value,
      "byWhen": this.addActionForm.get(this.addByWhenControl).value,
      "byWhoId":this.whoId,
      "byWhoChoiceId":this.addActionForm.get( this.addByWhoChoiceIdControl).value,
      "markAsComplete": false,
      "markAsInComplete": false,
      "userId": this.userId,
    }
  }

  fetchGoalActionList() {
    this.planInductionService.getActionPlanGoalList(this.userId).subscribe(data => {
      this.goalList = data.filter(item => item.questionId === this.questionId);
    });
  }

  onEditClicked(id) {    

    this.uncheckAll();
    this.hideAddGoal = false;
    this.planInductionService.getActionDetails(id,this.userId).subscribe(data=>{
      this.defineAndSetValidators();
      this.addActionForm.get(this.addActionControl).setValue(data.action);
      this.addActionForm.get(this.addCommentControl).setValue(data.comment);
      this.addActionForm.get(this.addByWhenControl).setValue(data.byWhen);
      this.addActionForm.get(this.markAsCompleteActionControl).setValue(data.markAsComplete);
      this.addActionForm.get(this.markAsInCompleteActionControl).setValue(data.markAsInComplete);
      this.addActionForm.get(this.addByWhoChoiceIdControl).setValue(data.actionId);
      let actionObj = this.refActionChoiceList.filter(obj => obj.id === data.actionId)[0];
      if(actionObj.name === 'No' ){
        this.showDropdown = true;
        this.addActionForm.get(this.addByWhoIdControl).setValue(data.byWhoId);
        this.actionLabel='Person responsible';
      }
      else if(actionObj.name === 'Joint action'){
        this.showDropdown = true;
        this.addActionForm.get(this.addByWhoIdControl).setValue(data.byWhoId);
        this.actionLabel='Who else is responsible';
      }
      else {
        this.showDropdown = false;
      }
      this.goalId = data.goalId;
      this.isEditable = data.isEditable;
      this.actionId =data.id;
    })
    document.getElementById('gds_innerModal').scrollTo(0,0);
  }

  updateAction() {
    this.setValidators(this.addActionForm, PLAN_INDUCTION_VALIDATION_CONTEXT);
    this.defineAndSetValidators();
    if(this.addActionForm.valid) {
      const payload = this.formatEditActionPayload();
      this.planInductionService.updateAction(payload).subscribe(result => {
        this.fetchGoalActionList();
        this.clearAllValidatorsAndErrors(this.addActionForm);
        this.hideAddGoal = true;
        this.initForm();
        this.uncheckAll();
        this.close();
      }, error => {
        this.notification.error([error.error.applicationMessage], true); 
      })
    }
    else {
      this.setFocusToErrorSummary();
    }
  }

  formatEditActionPayload() {
    this.getChoice();
    return {
      "id": this.actionId,
      "goalId": this.goalId,
      "action": this.addActionForm.get(this.addActionControl).value,
      "comment": this.addActionForm.get(this.addCommentControl).value,
      "byWhen": this.addActionForm.get(this.addByWhenControl).value,
      "byWhoId":this.whoId,
      "byWhoChoiceId":this.addActionForm.get( this.addByWhoChoiceIdControl).value,
      "markAsComplete": this.addActionForm.get(this.markAsCompleteActionControl).value,
      "markAsInComplete": this.addActionForm.get(this.markAsInCompleteActionControl).value,
      "userId": this.userId,
    }
  }

  getChoice() {
    const objAction = Utility.getObjectFromArrayByKeyAndValue(this.refActionChoiceList, 'id', this.addActionForm.get(this.addByWhoChoiceIdControl).value)

    if (objAction.name === 'Yes') {
      this.whoId = this.userId;
    }
    else {
      this.whoId = this.addActionForm.get(this.addByWhoIdControl).value;
    }
  }

  defineAndSetValidators() {
    let objAction;
    if (this.refActionChoiceList) {
      objAction = Utility.getObjectFromArrayByKeyAndValue(this.refActionChoiceList, 'id', this.addActionForm.get(this.addByWhoChoiceIdControl).value)
    }

    if (objAction && (objAction.name === 'No' || objAction.name === 'Joint action')) {
      this.setValidators(this.addActionForm, PLAN_INDUCTION_VALIDATION);
    }
    else if (objAction && objAction.name === 'Yes') {
      this.clearControl(this.addActionForm);
    }
  }

  getRefActionChoiceList(){
    this.planInductionService.getRefActionChoices().subscribe(data => {
      this.refActionChoiceList = data;
    });
  }

  radioChangeHandler(actionId,actionName) {
    if (actionName !== 'Yes') {
      this.showDropdown = true;
    }
    else {
      this.showDropdown = false;
    }

    this.addActionForm.get(this.addByWhoIdControl).reset();
    if(actionName == 'No' ){
      this.actionLabel='Person responsible';
    }
    else {
      this.actionLabel='Who else is responsible';
    }
    let name = 'byWhoChoiceId_' + this.questionId;
    this.addActionForm.controls[`${name}`].setValue(actionId);
   
  }

  clearControl(form: FormGroup): void {
    Object.keys(form.controls).forEach(name => {
      if(name === this.addByWhoIdControl){
      const control = form.get(name);
      control.clearValidators();
      control.setErrors(null);
      control.markAsTouched();
      }
    });
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

  close() {
    this.showDropdown = false;
    document.getElementById('gds_innerModal').scrollTo(0,0);
    this.visible = false;
    this.renderer.removeClass(document.body, 'modal-open');
    this.closeDialogEvent.emit();
    window.scroll(0,0);
  }

  get visible(): boolean {
    document.getElementById('myModalLabel').onkeydown = function (e) {
      if ((e.which === 9) && (e.shiftKey === true)) {
        e.preventDefault();
        document.getElementById('last').focus();
      }
    }
    const lastElement = document.getElementById('last');
    if (lastElement) {
      lastElement .onkeydown = function (e) {
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault();
          document.getElementById('myModalLabel').focus();
        }
      }
    }
    return this._visible;
  }

  set visible(val: boolean) {
    this._visible = val;
    if (this._visible) {
      (function () {
        document.getElementById('myModalLabel').focus();
      })();
      this.renderer.addClass(document.body, 'modal-open');
      const a = document.getElementById('myModalLabel');
      setTimeout(function () { a.focus(); }, 10);
    }
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
    if (event.target.id === "id-"+this.markAsCompleteActionControl) {
      this.addActionForm.get(this.markAsCompleteActionControl).setValue(true);
      this.addActionForm.get(this.markAsInCompleteActionControl).setValue(false);
    }
    else {
      this.addActionForm.get(this.markAsCompleteActionControl).setValue(false);
      this.addActionForm.get(this.markAsInCompleteActionControl).setValue(true);
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
