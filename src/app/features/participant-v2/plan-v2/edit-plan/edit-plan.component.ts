import { Component, EventEmitter, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Model, StylesManager } from 'survey-core';
import * as SurveyCore from "survey-core";
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { IAssessmentTemplate } from 'src/app/features/assessment/assessment.interface';
import { CompleteAssessmentsService } from 'src/app/features/captr-learners/view-captr-learner/complete-assessments/complete-assessments.service';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { PlanV2Service } from '../plan-v2.service';
import { ConfirmService } from 'src/app/features/shared/components/confirm-box/confirm-box.service';
import { AssessmentStatusService } from 'src/app/features/shared/services/assessment-status.service';

@Component({
  selector: 'app-edit-plan',
  templateUrl: './edit-plan.component.html',
  styleUrls: ['./edit-plan.component.scss']
})
export class EditPlanComponent implements OnInit, OnDestroy {
  fname: string;x
  lname: string;
  userId: number;
  json;
  answerJson;
  assessmentTemplate;
  assessmentName;
  length = 0;
  isCompleted: boolean = false;
  isPartiallyCompleted: boolean = false;
  assessmentTemplates: IAssessmentTemplate[];
  filteredAssessmentTemplate: IAssessmentTemplate[];
  private assessmentTemplateId: any;
  private assessmentTemplateUserId: any;
  private contractId: any;
  noAssessmentMessage = 'Ups! The requested assessment is not available.';
  private score: number = 0;
  assessmentSaved: Boolean = false;
  status: any;
  assessmentUrl;
  loggedInUserType: any;
  model: Model;
  title='';

  @ViewChild('model') surveyModel: Model;
  assessmentTemplateType: String;

  profileUrl;
  assessmentType: string

  constructor(
    private readonly completeAssessmentsService: CompleteAssessmentsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly _onConfirmService: AppConfirmService,
    private readonly planV2Service: PlanV2Service,
    private readonly confirm: ConfirmService,
private readonly assessmentStatusService: AssessmentStatusService,

  ) {
    SurveyCore.ChoicesRestfull.onBeforeSendRequest = ( function (sender, options) {
      options.request.setRequestHeader("X-Authorization", "Bearer " + localStorage.getItem('token'));
    });
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    if (this.profileUrl === 'person-supported') {
      this.title = 'Plan';
  } else {
      this.title = 'Assessment';  
  }
    this.route.snapshot.parent.data['title'] = '';
    this.setTitle();
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.userId = params.id;
        this.assessmentTemplateId = params.tp_id;
        this.assessmentType = params.a_type;
        this.assessmentTemplateUserId = +params.assessmentTemplateUserId,
          this.status = params.status
          this.contractId = +params.contractId
      }
      this.route.snapshot.data["title"] = `${this.fname}`;
    });
  }

  ngOnInit() {
    StylesManager.applyTheme("defaultV2");
    if (typeof this.status === "undefined") {
      this.getUserAssessmentJsons();
    }
    else {
      this.getUserAssessment()
    }
  }

  getUserAssessmentJsons() {
    let selectedOption = {
      assessmentTemplateId: + this.assessmentTemplateId,
      serviceUserId: + this.userId,
      assessmentType: this.assessmentType,
      contractId: this.contractId
    }
    this.planV2Service.assignAssesment(selectedOption).subscribe(
      data => {
        this.assessmentTemplate = data.assessmentTemplate;
        this.assessmentTemplateUserId = data.assessmentTemplateUserId;
         this.assessmentName = this.assessmentTemplate.assessmentName;
        this.json = JSON.parse(this.assessmentTemplate.questionJson);
        console.log(this.json);
        this.surveyModel = new Model(this.json);
        this.surveyModel.onComplete.add((sender, options) => {
        });
        this.model = this.surveyModel;
      },
      err => console.error(err),
      () => this.renderAssessment()
    );
  }

  renderAssessment() {
    const surveyValueChanged = function (sender, options) {
      const question = sender.getQuestionByName(options.name);
      if (question && question.isRequired && options.value) {
        question.runValidators();
        question.clearErrors();
      } else if (question && question.isRequired) {
        question.hasErrors();
      }
    };

    Survey.SurveyNG.render('surveyElement', {
      model: this.surveyModel,
      onValueChanged: surveyValueChanged
    });
  }
  saveSurveyResponse(result) {
    const resultData = {
      userId: this.userId,
      userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName,
      assessmentTemplateId: this.assessmentTemplateId,
      assessmentTemplateUserId: this.assessmentTemplateUserId,
      answerJson: result.surveyModel.data,
      isCompleted: false,
      isPartiallyCompleted: true
    };

    if (this.isFormValueChanged(result)) {
      this.isCompleted = false;
      this.isPartiallyCompleted = true;
      this.saveAssessmentResult(resultData);
    } else {
      this.snackBarService.error(`Select minimum of one answer!`);
    }
  }

  saveAssessmentResult(resultData) {
    this.planV2Service.saveILPAssessmentResult(resultData).subscribe(
      (data: any) => {
        this.assessmentSaved = true;
        if (this.isPartiallyCompleted) {
          this.snackBarService.success(`Assessment saved successfully!`);

          this.router.navigate([this.profileUrl + '/plan-v2'], { queryParams: { id: this.userId, name: this.fname } });
        } else if (this.isCompleted) {
          this.snackBarService.success(`Assessment completed successfully!`);
          this.router.navigate([this.profileUrl + '/plan-v2/add-goals'], { queryParams: { id: this.userId, name: this.fname, assessmentTemplateId: this.assessmentTemplateId,assessmentTemplateUserId:this.assessmentTemplateUserId } });
        }
      },
      (error: any) => {
        this.snackBarService.error(error.errorMessage);
        this.router.navigate([this.profileUrl + '/plan-v2'], { queryParamsHandling: "merge" });
      }
    );
  }

  completeSurveyResponse(result) {
    this.score = 0;
    const scoreQuestion = result.surveyModel.getQuestionByName("score");
    if (scoreQuestion) {
      const keys = Object.keys(result.surveyModel.data);
      const pages = this.json.pages;
      pages.forEach(page => {
        const elements = page.elements;
        elements.forEach(question => {
          if (keys.includes(question.name) && result.surveyModel.getQuestionByName(question.name) !== null) {
            this.score += this.getScoreByQuestion(result, question);
          }
        });
      });
      scoreQuestion.value = this.score;
    }

    if (!result.surveyModel.checkIsCurrentPageHasErrors()) {
      const resultData = {
        userId: this.userId,
        userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName,
        assessmentTemplateId: this.assessmentTemplateId,
        assessmentTemplateUserId: this.assessmentTemplateUserId,

        answerJson: result.surveyModel.data,
        isCompleted: true,
        isPartiallyCompleted: false
      };
      this.isCompleted = true;
      this.isPartiallyCompleted = false;
      this.assessmentSaved = true;
      this.saveAssessmentResult(resultData)
    }
  }

  getScoreByQuestion(result: any, question: any) {
    const questionName = question.name;
    const elementType = result.surveyModel.getQuestionByName(questionName).getType();
    let count = 0;
    if (elementType === 'checkbox') {
      const itemValue = result.surveyModel.data[questionName];
      itemValue.forEach(checkBoxOptions => {
        count += this.getCount(question, checkBoxOptions);
      });
    } else if (elementType === 'bootstrapslider') {
      const itemValue = result.surveyModel.data[questionName];
      count = Number(itemValue);
    } else if (elementType !== 'expression' && elementType !== 'html' && elementType !== 'comment') {
      const itemValue = result.surveyModel.data[questionName];
      count = this.getCount(question, itemValue);
    }
    return count;
  }

  getCount(question, itemValue) {
    let count = 0;
    if (question.rateValues && question.type === 'rating') {
      question.rateValues.forEach(choice => {
        if (choice.value === itemValue && choice.score) {
          count = Number(choice.score);
        }
      });
    } else {
      if (question.choices) {
        question.choices.forEach(choice => {
          if (choice.score && choice.value === itemValue) {
            count = Number(choice.score);
          }
        });
      }
    }
    return count;
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onExitClicked(result) {
    if (this.isExitAllowed(result)) {
      const dialogRef = this._onConfirmService.confirm({
        title: `Exit Assessment`,
        message: `Please save your Assessment before leaving?`,
        showOkButtonOnly: true,
      });
      return this.confirm.navigateSelection;
    } else {
      this.assessmentSaved = true;
      this.router.navigate([this.profileUrl + '/plan-v2'], { queryParams: { id: this.userId, name: this.fname } });
    }
  }

  isFormValueChanged(result) {
    let isFormValueChanged = false;
    if (result.surveyModel.data) {
      const keys = Object.keys(result.surveyModel.data);
      if (keys && keys.length > 0) {
        keys.forEach(element => {
          if (result.surveyModel.getQuestionByName(element) &&
            result.surveyModel.getQuestionByName(element).getType() !== 'expression') {
            isFormValueChanged = true;
          }
        });
      }
    }
    return isFormValueChanged;
  }

  isExitAllowed(result) {
    let isFormValueChanged = false;
    const keys = Object.keys(result.surveyModel.data);
    let answerKeys = null;
    if (this.answerJson !== null && this.answerJson !== undefined) {
      answerKeys = Object.keys(this.answerJson);
    }
    if (keys && answerKeys && keys.length !== answerKeys.length) {
      isFormValueChanged = true;
    }
    if (keys && keys.length > 0 && !isFormValueChanged) {
      keys.forEach(element => {
        const question = result.surveyModel.getQuestionByName(element);
        if (question && (answerKeys === null || answerKeys === undefined) && question.getType() !== 'expression') {
          isFormValueChanged = true;
        } else if (question && question.getType() !== 'expression' && !isFormValueChanged && this.answerJson[element] !== result.surveyModel.data[element]) {
          isFormValueChanged = true;
        }
      });
    }
    return isFormValueChanged;
  }

  getUserAssessment() {
    this.completeAssessmentsService.getAssessments(this.assessmentTemplateId).subscribe(
      data => {
        this.assessmentTemplate = data;
        this.assessmentName = this.assessmentTemplate.assessmentName;
        this.json = JSON.parse(this.assessmentTemplate.questionJson);
        this.surveyModel = new Model(this.json);
        if (this.status == 'In progress') {
          this.completeAssessmentsService.getCompletedAssessment(this.assessmentTemplateUserId, this.assessmentTemplateId).subscribe(
            answerData => {
              this.answerJson = JSON.parse(answerData.answerJson);
              this.surveyModel.data = this.answerJson;
              this.length = Object.keys(this.answerJson).length;
            }
          )
        }
      },
      err => console.error(err),
      () => this.renderAssessment()
    );
  }

  canExit(any) {
    if (this.assessmentSaved) {
      return true;
    }
    else {
      const dialogRef = this._onConfirmService.confirm({
        title: `Exit Plan`,
        message: `Please save your plan before leaving the page.`,
        showOkButtonOnly: true,
      });
      return this.confirm.navigateSelection;
    }
  }
}
