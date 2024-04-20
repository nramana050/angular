import { Component, EventEmitter, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { IAssessmentTemplate } from '../../complete-assessments/assessment.interface';
import { CompleteAssessmentsService } from '../../complete-assessments/complete-assessments.service';
import { Model, StylesManager } from 'survey-core';
import * as SurveyCore from "survey-core";
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

widgets.bootstrapslider(Survey);

@Component({
  selector: 'app-edit-performance-review-assessment',
  templateUrl: './edit-performance-review-assessment.component.html',
  styleUrls: ['./edit-performance-review-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EditPerformanceReviewAssessmentComponent implements OnInit, OnDestroy {
  fname: string;
  lname: string;
  prn: string;
  userId: string;
  json;
  answerJson;
  assessmentTemplate;
  assessmentName;
  surveyItem;
  length = 0;
  isCompleted: boolean = false;
  isPartiallyCompleted: boolean = false;
  assessmentTemplates: IAssessmentTemplate[];
  filteredAssessmentTemplate: IAssessmentTemplate[];
  private assessmentTemplateId: any;
  private assessmentTemplateUserId: any;
  noAssessmentMessage = 'Ups! The requested assessment is not available.';
  private score: number = 0;

  status;
  assessmentUrl;
  loggedInUserType: any;
  model: Model;

  @ViewChild('model') surveyModel: Model;
  isStaffCompleted: any;
  isStaffPartiallyCompleted: any;
  assessmentTemplateType: String;
  profileUrl;


  constructor(
    private readonly completeAssessmentsService: CompleteAssessmentsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly _onConfirmService: AppConfirmService,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly mentivityLearnerNavigation: MentivityLearnerNavigation,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.loggedInUserType =  JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userType
      this.route.snapshot.parent.data['title'] ='';
          this.setTitle();
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.userId = params.id;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  ngOnInit() {
    StylesManager.applyTheme("defaultV2");
    SurveyCore.ChoicesRestfull.onBeforeSendRequest = function (sender, options) {
      options.request.setRequestHeader("X-Authorization", "Bearer " + localStorage.getItem('token'));
    };
    this.getUserAssessmentJsons();
  }

  getUserAssessmentJsons() {
    this.route.queryParams.subscribe((params: any) => {
      this.assessmentTemplateId = params.assessmentTemplateId;
      this.assessmentTemplateUserId = params.assessmentTemplateUserId;
      this.isPartiallyCompleted = JSON.parse(params.isPartiallyCompleted);
      this.isCompleted = JSON.parse(params.isCompleted);
       this.isStaffCompleted = JSON?.parse(params?.isStaffCompleted);
       this.isStaffPartiallyCompleted = JSON?.parse(params?.isStaffPartiallyCompleted);
      this.completeAssessmentsService.getAssessments(this.assessmentTemplateId).subscribe(
        data => {
          this.assessmentTemplate = data;
          this.assessmentName = this.assessmentTemplate.assessmentName;
          this.json = JSON.parse(this.assessmentTemplate.questionJson);
          this.surveyModel = new Model(this.json);
           if(this.loggedInUserType ==1 || this.loggedInUserType ==2){
            this.surveyModel.setValue("Usertype", "staff");     
         }   
         this.surveyModel.onLoadChoicesFromServer.add(function (sender, options) {
          if (options.question.name == "Roleaspiration") {
            sender.getQuestionByName("Roleaspiration").value = options?.serverResult[0]?.name
          }
        });
        this.surveyModel.onValueChanged.add((sender, options) => {
          if (options.name == "Currentrole") {
            SurveyCore.ChoicesRestfull.clearCache();
          }
          if (options.name == "Roleaspiration") {
            console.log('options Roleaspiration', options.question.choicesFromUrl);
          }
        });
        this.surveyModel.onComplete.add((sender, options) => {
          console.log(JSON.stringify(sender.data, null, 3));
        });
        this.model = this.surveyModel;
          if (this.isPartiallyCompleted || this.isCompleted) {
            this.completeAssessmentsService.getCompletedAssessment(this.assessmentTemplateUserId,this.assessmentTemplateId).subscribe(
              answerData => {
                this.answerJson = JSON.parse(answerData.answerJson);
                this.surveyModel.data = this.answerJson;
                this.surveyModel.setValue("Usertype", "staff"); 
                this.length = Object.keys(this.answerJson).length;
              }
            )}   
        },
        err => console.error(err),
        () => this.renderAssessment()
      );
    });
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
    this.getStaffFlags(result,true);
    const resultData = {
      userId: this.userId,
      userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName,
      assessmentTemplateId: this.assessmentTemplateId,
      assessmentTemplateUserId: this.assessmentTemplateUserId,
      answerJson: result.surveyModel.data,
      isCompleted: this.isCompleted,
      isPartiallyCompleted: this.isPartiallyCompleted,
      isStaffCompleted: this.isStaffCompleted,
      isStaffPartiallyCompleted:this.isStaffPartiallyCompleted
    };
    if (this.isFormValueChanged(result)) {
      this.isCompleted = this.isCompleted;
      this.isPartiallyCompleted = this.isPartiallyCompleted;
      this.saveAssessmentResult(resultData);
    } else {
      this.snackBarService.error(`Select minimum of one answer!`);
    }
  }

  getStaffFlags(result,isDraft:Boolean){
    if(result.surveyModel.getQuestionByName('assessmentType')?.value != null ){
      if(isDraft){
      this.isStaffCompleted=false,
      this.isStaffPartiallyCompleted=true;
    }
    else{
      this.isStaffCompleted=true;
      this.isStaffPartiallyCompleted=false;
    }
  }
    else{
      this.isStaffCompleted=false;
      this.isStaffPartiallyCompleted=false;
    }
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
      this.getStaffFlags(result,false);
      const resultData = {
        userId: this.userId,
        userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName,
        assessmentTemplateId: this.assessmentTemplateId,
        assessmentTemplateUserId: this.assessmentTemplateUserId,
        answerJson: result.surveyModel.data,
        isCompleted: this.isCompleted,
      isPartiallyCompleted: this.isPartiallyCompleted,
      isStaffCompleted:this.isStaffCompleted,
      isStaffPartiallyCompleted:this.isStaffPartiallyCompleted
      };
      this.isCompleted = this.isCompleted;
      this.isPartiallyCompleted = this.isPartiallyCompleted;
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

  saveAssessmentResult(resultData) {
    this.completeAssessmentsService.saveAssessmentResult(resultData).subscribe(
      (data: any) => {
        if (this.isPartiallyCompleted || this.isStaffPartiallyCompleted) {
          this.snackBarService.success(`Assessment saved as draft successfully!`);
          this.router.navigate(['captr-learner/performance-review'],
            { queryParams: { id: this.userId, name: this.fname, status: this.status } });
        } else if (this.isCompleted) {
          this.snackBarService.success(`Assessment completed successfully!`);
          this.router.navigate(['captr-learner/performance-review'],
            { queryParams: { id: this.userId, name: this.fname, status: 'completed' } });
        }
      },
      (error: any) => {
        this.snackBarService.error(error.errorMessage);
        this.router.navigate([this.assessmentUrl, this.status],
          { queryParams: { id: this.userId, name: this.fname, } });
      });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onExitClicked(result) {
    if (this.isExitAllowed(result)) {
      const dialogRef = this._onConfirmService.confirm({
        title: `Exit Assessment`,
        message: `You have not saved your progress, do you want to continue without saving?`,
        okButtonName: 'Yes',
        cancelButtonName: 'No'
      });
      dialogRef.subscribe(output => {
        if (output) {
          this.router.navigate([this.profileUrl+'/performance-review'],  { queryParamsHandling :"merge"});
        }
      });
    } else {
      this.router.navigate([this.profileUrl+'/performance-review'],  { queryParamsHandling :"merge"});

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
        if (keys && keys.length > 0 && (answerKeys === null || answerKeys === undefined) && result.surveyModel.getQuestionByName(element).getType() !== 'expression') {
          isFormValueChanged = true;
        } else if (result.surveyModel.getQuestionByName(element).getType() !== 'expression' && !isFormValueChanged && this.answerJson[element] !== result.surveyModel.data[element]) {
          isFormValueChanged = true;
        }
      });
    }
    return isFormValueChanged;
  }
}
