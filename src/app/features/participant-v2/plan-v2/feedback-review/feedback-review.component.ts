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

@Component({
  selector: 'app-feedback-review',
  templateUrl: './feedback-review.component.html',
  styleUrls: ['./feedback-review.component.scss']
})
export class FeedbackReviewComponent implements OnInit, OnDestroy {

  fname: string;
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
  noAssessmentMessage = 'Ups! The requested assessment is not available.';
  private score: number = 0;
  assessmentSaved: Boolean = false;
  status: any;
  assessmentUrl;
  loggedInUserType: any;
  model: Model;

  @ViewChild('model') surveyModel: Model;
  assessmentTemplateType: String;

  profileUrl;
  assessmentType: string
  reviewType :number
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly _onConfirmService: AppConfirmService,
    private readonly participantV2Service: PlanV2Service,
    private readonly confirm: ConfirmService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.route.snapshot.data["title"] = `${this.fname}`;
        this.userId = params.id;
        this.assessmentTemplateId = +params.assessmentTemplateId;
        this.assessmentType = params.a_type;
        this.assessmentTemplateUserId = +params.assessmentTemplateUserId,
        this.reviewType=+params.reviewType
       
      }
    });
  }

  ngOnInit() {
      this.getUserAssessment()
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
    this.participantV2Service.saveFeedBackAssessmentResult(resultData).subscribe(
      (data: any) => {
        this.assessmentSaved = true;
        if (this.isPartiallyCompleted) {
          this.snackBarService.success(`Assessment saved successfully!`);

          this.router.navigate([this.profileUrl + '/plan-v2'], { queryParams: { id: this.userId, name: this.fname } });
        } else if (this.isCompleted) {
          this.snackBarService.success(`Assessment completed successfully!`);
          this.router.navigate([this.profileUrl + '/plan-v2'], { queryParams: { id: this.userId, name: this.fname, assessmentTemplateId: this.assessmentTemplateId,assessmentTemplateUserId:this.assessmentTemplateUserId } });
        }
      },
      (error: any) => {
        this.snackBarService.error(error.errorMessage);
        this.router.navigate([this.profileUrl + '/plan-v2'], { queryParamsHandling: "merge" });
      }
    );
  }

  completeSurveyResponse(result) {

    if (!result.surveyModel.checkIsCurrentPageHasErrors()) {
      const resultData = {
        userId: this.userId,
        userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName,
        assessmentTemplateId: this.assessmentTemplateId,
        assessmentTemplateUserId: this.assessmentTemplateUserId,

        answerJson: result.surveyModel.data,
        isCompleted: true,
        isPartiallyCompleted: false,
        reviewTypeId:this.reviewType
      };
     
      this.isCompleted = true;
      this.isPartiallyCompleted = false;
      this.assessmentSaved = true;
      this.saveAssessmentResult(resultData)
    }
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
    this.participantV2Service.getFeedbackAssessments(this.assessmentTemplateId,this.assessmentTemplateUserId).subscribe(
      data => {
        this.assessmentTemplate = data;
        this.assessmentName = this.assessmentTemplate.assessmentName;
        this.json = JSON.parse(this.assessmentTemplate.reviewFeedbackJson);
        this.surveyModel = new Model(this.json);
        this.answerJson = JSON.parse(this.assessmentTemplate.reviewFeedbackAnsJson);
        this.surveyModel.data = this.answerJson;
        this.length = Object.keys(this.answerJson).length;
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
