import { Component, EventEmitter, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompleteAssessmentsService } from '../complete-assessments.service';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import { IAssessmentTemplate } from '../assessment.interface';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

widgets.bootstrapslider(Survey);



@Component({
  selector: 'app-complete-assessment',
  templateUrl: './complete-assessment.component.html',
  styleUrls: ['./complete-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CompleteAssessmentComponent implements OnInit, OnDestroy {
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
  profileUrl;
  title='';

  constructor(
    private readonly completeAssessmentsService: CompleteAssessmentsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly _onConfirmService: AppConfirmService,
    private readonly captrLearnersService: CaptrLearnersService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    if (this.profileUrl === 'person-supported') {
      this.title = 'Quiz';
  } else {
      this.title = 'Assessment';  
  }
        this.route.snapshot.parent.data['title'] ='';



      this.setTitle();
  }


  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.userId = params.id;
        this.status = params.status;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  ngOnInit() {
    this.assessmentUrl = this.profileUrl +'/assessments';
    this.getUserAssessmentJsons();
  }

  getUserAssessmentJsons() {
    this.route.queryParams.subscribe((params: any) => {
      this.assessmentTemplateId = params.assessmentTemplateId;
      this.assessmentTemplateUserId = params.assessmentTemplateUserId;
      this.isPartiallyCompleted = JSON.parse(params.isPartiallyCompleted);

      this.completeAssessmentsService.getAssessments(this.assessmentTemplateId).subscribe(
        data => {
          this.assessmentTemplate = data;
          this.assessmentName = this.assessmentTemplate.assessmentName;
          this.json = JSON.parse(this.assessmentTemplate.questionJson);
          this.surveyItem = new Survey.Model(this.json);
          if (this.isPartiallyCompleted) {
            this.completeAssessmentsService.getCompletedAssessment(this.assessmentTemplateUserId,this.assessmentTemplateId).subscribe(
              answerData => {
                this.answerJson = JSON.parse(answerData.answerJson);
                this.surveyItem.data = this.answerJson;
                this.length = Object.keys(this.answerJson).length;
              }
            )
          }
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
      model: this.surveyItem,
      onValueChanged: surveyValueChanged
    });
  }

  saveSurveyResponse(result) {
    const resultData = {
      userId: this.userId,
      userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName,
      assessmentTemplateId: this.assessmentTemplateId,
      assessmentTemplateUserId: this.assessmentTemplateUserId,
      answerJson: result.surveyItem.data,
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

  completeSurveyResponse(result) {
    this.score = 0;
   
    const scoreQuestion = result.surveyItem.getQuestionByName("score");
    
    if (scoreQuestion) {
      const keys = Object.keys(result.surveyItem.data);
      const pages = this.json.pages;
      pages.forEach(page => {
        const elements = page.elements;
        elements.forEach(question => {
          if (keys.includes(question.name) && result.surveyItem.getQuestionByName(question.name) !== null) {
            this.score += this.getScoreByQuestion(result, question);
          }
        });
      });
      scoreQuestion.value = this.score;
    }

    if (!result.surveyItem.checkIsCurrentPageHasErrors()) {
      const resultData = {
        userId: this.userId,
        userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName,
        assessmentTemplateId: this.assessmentTemplateId,
        assessmentTemplateUserId: this.assessmentTemplateUserId,
        answerJson: result.surveyItem.data,
        isCompleted: true,
        isPartiallyCompleted: false
      };
      this.isCompleted = true;
      this.isPartiallyCompleted = false;
      this.saveAssessmentResult(resultData)
    }

  }

   getScoreByQuestion(result: any, question: any) {
    const questionName = question.name;
    const elementType = result.surveyItem.getQuestionByName(questionName).getType();
    let count = 0;
    if (elementType === 'checkbox') {
      const itemValue = result.surveyItem.data[questionName];
      itemValue.forEach(checkBoxOptions => {
        count += this.getCount(question, checkBoxOptions);
      });
    } else if (elementType === 'bootstrapslider') {
      const itemValue = result.surveyItem.data[questionName];
      count = Number(itemValue);
    } else if (elementType !== 'expression' && elementType !== 'html' && elementType !== 'comment') {
      const itemValue = result.surveyItem.data[questionName];
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
        if (this.isPartiallyCompleted) {
          this.snackBarService.success(`Assessment saved successfully!`);
          this.router.navigate([this.assessmentUrl, this.status],
            { queryParams: { id: this.userId, name: this.fname, status: this.status } });
        } else if (this.isCompleted) {
          this.snackBarService.success(`Assessment completed successfully!`);
          this.router.navigate([this.assessmentUrl, this.status],
            { queryParams: { id: this.userId, name: this.fname, status: 'completed' } });
        }
      },
      (error: any) => {
        this.snackBarService.error(error.errorMessage);
        this.router.navigate([this.assessmentUrl, this.status],
          { queryParams: { id: this.userId, name: this.fname, } });
      }
    );
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
          this.router.navigate([this.profileUrl + '/assessments', this.status],
          { queryParams: { id: this.userId, name: this.fname, status: this.status } });
        }
      });
    } else {
      this.router.navigate([this.profileUrl +'/assessments', this.status],
      { queryParams: { id: this.userId, name: this.fname, status: this.status } });
    }

  }


  isFormValueChanged(result) {
    let isFormValueChanged = false;
    if (result.surveyItem.data) {
      const keys = Object.keys(result.surveyItem.data);
      if (keys && keys.length > 0) {
        keys.forEach(element => {
          if (result.surveyItem.getQuestionByName(element) &&
           result.surveyItem.getQuestionByName(element).getType() !== 'expression') {
            isFormValueChanged = true;
          }
        });
      }
    }

    return isFormValueChanged;
  }

  isExitAllowed(result) {
    let isFormValueChanged = false;
    const keys = Object.keys(result.surveyItem.data);
    let answerKeys = null;
    if (this.answerJson !== null && this.answerJson !== undefined) {
      answerKeys = Object.keys(this.answerJson);
    }

    if (keys && answerKeys && keys.length !== answerKeys.length) {
      isFormValueChanged = true;
    }

    if (keys && keys.length > 0 && !isFormValueChanged) {
      keys.forEach(element => {
        if (keys && keys.length > 0 && (answerKeys === null || answerKeys === undefined) && result.surveyItem.getQuestionByName(element).getType() !== 'expression') {
          isFormValueChanged = true;
        } else if (result.surveyItem.getQuestionByName(element)?.getType() !== 'expression' && !isFormValueChanged && this.answerJson[element] !== result.surveyItem.data[element]) {
          isFormValueChanged = true;
        }
      });
    }
    return isFormValueChanged;
  }
}
