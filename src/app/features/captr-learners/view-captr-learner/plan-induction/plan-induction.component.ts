import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanInductionService } from './plan-induction.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmService } from '../../../../features/shared/components/confirm-box/confirm-box.service';
import { PLAN_INDUCTION_VALIDATION_CONTEXT } from './plan-induction.validation';
import { ValidationService } from 'src/app/features/shared/components/form-control/validation.service';
import { NotificationService } from 'src/app/features/shared/components/notification/notification.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewAssessmentPopUpComponent } from './view-assessment-pop-up/view-assessment-pop-up.component';
import { CompleteAssessmentsService } from '../complete-assessments/complete-assessments.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { ParticipantNavigation } from 'src/app/features/participant-v2/view-participant/participant-nav';

export let PLAN_INDUCTION_VALIDATION = {}

const CHECK_ANS = '/captr-learner/profile/check-answer';
const ACTION_PLAN = '/captr-learner/profile/action-plan';

@Component({
  selector: 'app-plan-induction',
  templateUrl: './plan-induction.component.html',
  styleUrls: ['./plan-induction.component.scss']
})
export class PlanInductionComponent implements OnInit, OnDestroy {

  fname: string;
  prn: string;
  inductionData = [];
  inductionHistory = [];
  noInductionMessage: string;
  planStatus: string;
  planDate: string;
  ActionPlanForm: FormGroup;
  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  currentPageData:any[] = [] as any;
  userId: any;
  isSaveSubmitOperation = false;
  showQuestion: boolean = false;
  isSignoutClicked: any;
  refData = [] as any;
  id: any;
  @ViewChild("question", { static: false }) questionDiv: ElementRef;
  starPlanData: any[];
  workerList = [] as any;
  addQuetionTitle: string
  goalList = [];
  accGoalList = [];
  actionPlanCreatedFlag = null;
  planVersionList: any;
  actionPlan: boolean;
  checkAnswer: boolean;
  minLimitEntryMessage = "Please add at least 1 goal per area.";
  minActionLimitMessage = "Please add at least 1 action per goal.";
  checkAnsPath: './captr-learner/profile/check-answer';
  minGoalLimitValidate: boolean;
  minActionLimitValidate: boolean;
  actionPlanGoalList: any;
  childForm: any;
  questionData:any[]
  answerData:any;

  qIndex;
  loadDom = false;
  dependantQuestion:any[];
  allAssessments:any[];
  latestCompletedAssessment:any[];
  assessmentQuestionData:any;
  firstName;
  isAuthorized = false;
 
  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly route: ActivatedRoute,
    private readonly planInductionService: PlanInductionService,
    private readonly fb: FormBuilder,
    private readonly renderer: Renderer2,
    private readonly confirm: ConfirmService,
    private readonly router: Router,
    private readonly validation: ValidationService,
    private readonly notification: NotificationService,
    private readonly snackBarService:SnackBarService,
    public  dialog: MatDialog,
    private readonly completeAssessmentsService:CompleteAssessmentsService,
    private readonly sessionService: SessionsService,
  ) {
     
       this.setTitle();
    this.validation.setContext(PLAN_INDUCTION_VALIDATION_CONTEXT);
    this.route.queryParams.subscribe((param: any) => {
      if (param.id) {
        this.userId = +param.id;
      }
    })
  }

  ngOnInit() {
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.getActionPlanSection();
    this.getRefData();
    this.checkActionPlanStatus();
    this.getAssessmentDetailsByType();
    this.isSaveSubmitOperation = false;
    this.minGoalLimitValidate = true;
    this.minActionLimitValidate = true;
  }

  getRefData() {
    this.planInductionService.getRefData().subscribe(data => {
      this.refData = data;
      this.resolveCurrentPageData(57);
    })
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.firstName = `${this.fname.split(' ')[0].toLowerCase()}'s`
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  fetchGoalList(queId) {
    this.planInductionService.getActionPlanGoalList(this.userId).subscribe(data => {
      this.goalList = data.filter(item => item.questionId === queId);
    });
  }

  initForm(currentPageData) {
    this.ActionPlanForm = this.fb.group({ })
    currentPageData.forEach(question => {
      this.ActionPlanForm.addControl(String(question.id), new FormControl(question.answer ? question.answer.toString() : ''));
    
    })
    this.ActionPlanForm.addControl('goal_362', new FormControl(null));
  }

  resolveCurrentPageData(questionNumber) {
    this.loadDom = false
    this.planInductionService.getQuestion(questionNumber, this.userId).subscribe(data => {
      this.questionData = data;
      data.forEach(group => {
        group.questionList.forEach(question => {
          this.currentPageData.push({
            question: question.questionDescription,
            type: question.questionTypeIdentifier ? this.planInductionService.resolveQuestionType(question.questionTypeIdentifier, this.refData) : null,
            answersLabels: question.domainIdentifier ? this.planInductionService.resolveQuestionAnswersLabels(question.domainIdentifier, this.refData) : null,
            answersValues: question.domainIdentifier ? this.planInductionService.resolveQuestionAnswersValues(question.domainIdentifier, this.refData) : null,
            sectionIdentifier: question.sectionIdentifier,
            answers: this.getAnswersList(question),
            id: question.id,
            answer: question.answer,
            qId: question.id.toString(),
            componentType: question.componentType,
            groupDescription: group.groupDescription.toLowerCase(),
            parentId: question.parentQuestionId
          })

        })

      })
      this.initForm(this.currentPageData)

      this.currentPageData.forEach(question => {
        PLAN_INDUCTION_VALIDATION[question.id] = [Validators.required];

        const goalControl = 'goal_' + question.id
        const actionControl = 'action_' + question.id
        const byWhoIdControl = 'byWhoId_' + question.id
        const byWhenControl = 'byWhen_' + question.id
        const byWhoChoiceIdControl = 'byWhoChoiceId_' + question.id

        if (question.componentType === 'rating')
          PLAN_INDUCTION_VALIDATION_CONTEXT.required[question.qId] = ` Please rate for ${question.groupDescription} `
        else {
          /* Error message for required */
          PLAN_INDUCTION_VALIDATION_CONTEXT.required[question.qId] = ` Please select priority for ${question.groupDescription} `
          PLAN_INDUCTION_VALIDATION_CONTEXT.required[goalControl] = `Please add your goal`
          PLAN_INDUCTION_VALIDATION_CONTEXT.required[actionControl] = `Please add your action`
          PLAN_INDUCTION_VALIDATION_CONTEXT.required[byWhoIdControl] = `Please select user`
          PLAN_INDUCTION_VALIDATION_CONTEXT.required[byWhenControl] = `Please add date`
          PLAN_INDUCTION_VALIDATION_CONTEXT.required[byWhoChoiceIdControl] = `Please select choice`

          /*Error message for future*/
          PLAN_INDUCTION_VALIDATION_CONTEXT.futureDate[byWhenControl] = `Date cannot be in the future`
          /* Error message for invalidDate*/
          PLAN_INDUCTION_VALIDATION_CONTEXT.invalidDate[byWhenControl] = `Enter a valid date`
          /*Error message for minlength*/
          PLAN_INDUCTION_VALIDATION_CONTEXT.minlength[actionControl] = `Enter minimum 3 characters in the action`

          /*validations for self + child */
          PLAN_INDUCTION_VALIDATION[goalControl] = [Validators.required, Validators.maxLength(300)];
          PLAN_INDUCTION_VALIDATION[actionControl] = [Validators.required, Validators.maxLength(100)];
          PLAN_INDUCTION_VALIDATION[byWhenControl] = [Validators.required, ValidationService.dateValidator, ValidationService.monthYearValidator];
          PLAN_INDUCTION_VALIDATION[byWhoChoiceIdControl] = [Validators.required];
         
        }
      })
      this.loadDom = true;
    })
  }

  getAnswersList(question) {
    const answers = [];
    const type = question.questionTypeIdentifier ? this.planInductionService.resolveQuestionType(question.questionTypeIdentifier, this.refData) : null;
    const answersLabels = question.domainIdentifier ? this.planInductionService.resolveQuestionAnswersLabels(question.domainIdentifier, this.refData) : null;
    const answersValues = question.domainIdentifier ? this.planInductionService.resolveQuestionAnswersValues(question.domainIdentifier, this.refData) : null;
    if (answersValues && answersLabels && question.domainIdentifier && answersValues.length === answersLabels.length) {
      for (let index = 0; index < answersValues.length; index++) {
        const label = answersLabels[index];
        const value = answersValues[index];
        answers.push({ label: label, value: value, type: type, question: question.id });
      }
    }
    return answers;
  }

  resolveSavedAnswers(savedAnswer) {
    return JSON.parse(savedAnswer).choiceIds;
  }

  questionDisplay() {
    this.noInductionMessage = null
    this.showQuestion = true;
    this.planInductionService.getAnsweredQuestion(this.userId).subscribe(data => {
      sessionStorage.removeItem('routeState');
      if (this.actionPlanCreatedFlag === true) {
        this.router.navigate([CHECK_ANS], { queryParams: { id: this.userId, name: this.fname } });
      } else {
        this.router.navigate([ACTION_PLAN], { queryParams: { id: this.userId, name: this.fname } });
      }
    })
  }

  getActionPlanSection() {
    this.planInductionService.getQuestion("57", this.userId).subscribe(data => {
      this.starPlanData = data;
      if (data[0].answerId === null) {
        this.noInductionMessage = 'No Action Plan has been created.';
      }
    });

  }

  checkActionPlanStatus() {
    const planTypeIdentifier = "2";
    this.planInductionService.checkCarePlanStatus(this.userId, planTypeIdentifier).subscribe(result => {
      this.actionPlanCreatedFlag = result.isMainPlanAgree;
      if (!this.actionPlanCreatedFlag) {
        this.noInductionMessage = 'No Action Plan has been created.';
      }
      else {
        this.navigateRoute();
      }
    })
  }

  saveActionPlan() {
    this.setValidators(this.ActionPlanForm, PLAN_INDUCTION_VALIDATION);
    const payload = this.formattedPlanPayload();
    this.minGoalLimitValidate = true;
    this.minActionLimitValidate = true;
    if (this.ActionPlanForm.valid) {
      this.planInductionService.getActionPlanGoalList(this.userId).subscribe(data => {
        this.actionPlanGoalList=data;
        for (let i = 0; i < this.currentPageData.length; i++) {
          this.checkMinGoal(this.currentPageData[i].componentType,payload.questionDTOList[i].id);
        }
          if(this.minActionLimitValidate && this.minGoalLimitValidate) {
            this.saveValidActionPlan(payload);
         }
      })
    }
    this.setFocusToErrorSummary();
  }

  checkMinGoal(componentType,questionId){
    if (componentType === 'priority') {
      this.goalList =  this.actionPlanGoalList.filter(item => item.questionId === questionId);
      if (this.ActionPlanForm.controls[questionId.toString()].value === '1' && this.goalList.length === 0) {
        this.notification.error([this.minLimitEntryMessage], true);
        this.minGoalLimitValidate = false;
      }
      else if (this.goalList.length > 0) {
        this.checkMinAction();
      }
    }
  }

  checkMinAction(){
    for(let j = 0; j < this.goalList.length; j++){
      if(this.goalList[j].actionList.length === 0){
        this.notification.error([this.minActionLimitMessage], true);
        this.minActionLimitValidate = false;
      }
    }
  }

  saveValidActionPlan(payload: { isSaveAsDraft: boolean; planTypeIdentifier: string; questionDTOList: { answer: any; id: number; }[];
    sectionIdentifier: string; userId: any; }) {
    if (this.minGoalLimitValidate || this.minActionLimitValidate) {
      this.planInductionService.saveActionPlan(payload).subscribe(data => {
        this.isSaveSubmitOperation = true;
        this.router.navigate([CHECK_ANS], { queryParams: { id: this.userId, name: this.fname } });
        let message;
        !this.actionPlanCreatedFlag ? message = "Plan created successfully" : message = "Plan updated successfully"
        this.snackBarService.success(message);
      });
    }
    else {
      this.setFocusToErrorSummary();
    }
    window.scrollTo(1, 1);
  }

  setFocusToErrorSummary() {
    setTimeout(() => {
      const errorSummary = this.renderer.selectRootElement('.error-summary', true);
      errorSummary.focus();
    })
  }

  setFocusToQuestionDiv() {
    this.questionDiv.nativeElement.focus();
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

  formattedPlanPayload() {

    let formattedPayload :any = {
      "isSaveAsDraft": false,
      "planTypeIdentifier": "2",
      "sectionIdentifier": "57",
      "userId": this.userId,
      "questionDTOList": []
    };

    for (let i = 0; i < this.questionData.length; i++) {
      for (let j = 0; j < this.questionData[i].questionList.length; j++) {
        const answer = this.ActionPlanForm.controls[this.questionData[i].questionList[j].id.toString()].value;
        const id = this.questionData[i].questionList[j].id;
        const innerObj = {
          "answer": answer,
          "id": id
        }
        formattedPayload.questionDTOList.push(innerObj)
      }
    }

    return formattedPayload;
  }

  radioChangeHandler(questionId, answer, event) {
    this.planInductionService.getActionPlanGoalList(this.userId).subscribe(data => {
      let questionIds:any[] = this.currentPageData.map(data => data.id) 
      this.goalList = data.filter(item => (item.questionId === +questionId));
      if ((questionIds.includes(questionId) && answer === "2" && this.goalList.length === 0)) {
        this.clearValidatorsAndErrors([questionId]);
      }
      if ((questionIds.includes(questionId) && answer === "2" && (this.goalList.length !== 0))) {
        this.ActionPlanForm.get(questionId.toString()).setValue("1");
        this.confirm.confirm({
          header: 'Warning',
          message: 'Active goals are linked to this area, please update all goals statuses before removing the priority.',
          rejectLabel: 'Ok',
          rejectVisible: true,
          hasSecondPopup: false,
          reject: () => {
            this.confirm.choose(false);
          }
        });
      }
    });
  }


  clearValidatorsAndErrors(formControls: string[]): void {
    formControls.forEach(name => {
      const control = this.ActionPlanForm.get(name);
      control.clearValidators();
      control.setErrors(null);
      control.markAsTouched();
    });
  }

  childFormData( childFormData : any ){
    this.childForm = childFormData;
  }

  canDeactivate() {
    let isChildFormDirty = false;
    if(this.childForm && this.childForm.userForm && this.childForm.userForm?.dirty || this.childForm?.isValueChange){
      isChildFormDirty = true;
    } 

    if (this.ActionPlanForm?.dirty && !this.isSaveSubmitOperation) {
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

    if (isChildFormDirty == true && !this.isSaveSubmitOperation) {
      
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

  navigateRoute() {
    if (this.actionPlanCreatedFlag && sessionStorage.getItem('routeState') !== 'changeAnswer') {
      this.router.navigate([CHECK_ANS], { queryParams: { id: this.userId, name: this.fname } });
      sessionStorage.removeItem('routeState');
    }
    else {
      this.router.navigate([ACTION_PLAN], { queryParams: { id: this.userId, name: this.fname } });
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('routeState');
    this.inPageNavService.setNavItems(null);
  }

  showAnswer() {
    this.dialog.open(ViewAssessmentPopUpComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        assessmentQuestionData: this.assessmentQuestionData,
        firstName: this.firstName,
        answerData: this.answerData
      }
    })
  }

  getAssessmentDetailsByType() {
    this.completeAssessmentsService.getAssessmentDetailsByType('SU_Action_Plan_Assessment').subscribe(
      questionData => {
        this.assessmentQuestionData = questionData;
        this.completeAssessmentsService.getAssessmentResultByTemplateId(this.userId, questionData.assessmentTemplateId).subscribe(
          answerData => {
            this.answerData = answerData
          },
          err => console.error(err),
        );
      })
  }
 
  isAuthorize(fid) {
    return this.sessionService.hasResource([fid.toString()])
  }

  Authorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

}
