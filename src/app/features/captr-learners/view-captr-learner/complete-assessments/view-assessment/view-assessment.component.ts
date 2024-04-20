import { Component, Input, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompleteAssessmentsService } from '../complete-assessments.service';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import { IAssessmentTemplate } from '../assessment.interface';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

widgets.bootstrapslider(Survey);

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrls: ['./view-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ViewCompleteAssessmentComponent implements OnInit, OnDestroy {
  fname: string;
  lname: string;
  prn: string;
  userId: string;
  json;
  assessmentTemplate;
  updatedDate;
  updatedBy;
  assessmentName;
  surveyItem;
  isCompleted: string = 'false';
  partiallyCompleted;
  assessmentTemplates: IAssessmentTemplate[];
  filteredAssessmentTemplate: IAssessmentTemplate[];
  private assessmentTemplateId: any;
  private assessmentTemplateUserId: any;
  noAssessmentMessage = 'Ups! The requested assessment is not available.';
  status:any;
  pageIndex:any;
  togetherModeUserName;
  profileUrl;
  title='';

  constructor(
    private readonly completeAssessmentsService: CompleteAssessmentsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly captrLearnersService: CaptrLearnersService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);  

    if (this.profileUrl === 'person-supported') {
      this.title = 'Quiz';
  } else {
      this.title = 'Assessment';  
  }
    this.setTitle();
  }


  setTitle() {
    this.route.snapshot.parent.data['title'] = '';
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.fname = params.name;
        this.userId = params.id;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((param: any) => {
      this.pageIndex = param.pageIndex;
      this.status = param.status;
    })
    this.getUserAssessmentJsons();
  }

  getUserAssessmentJsons() {
    this.route.queryParams.subscribe((params: any) => {
      this.assessmentTemplateId = params.assessmentTemplateId;
      this.assessmentTemplateUserId = params.assessmentTemplateUserId;
      this.isCompleted = params.isCompleted;
      this.partiallyCompleted = params.isPartiallyCompleted;
      if (params.isCompleted === 'true') {
        this.setCompletedAssessment();
      } else {
        this.setNewAssessment(this.partiallyCompleted);
      }
    }
    )

  }

  setNewAssessment(partiallyCompleted) {
    this.completeAssessmentsService.getAssessments(this.assessmentTemplateId).subscribe(
      data => {
        this.assessmentTemplate = data;
        this.assessmentName = this.assessmentTemplate.assessmentName;
        this.json = JSON.parse(this.assessmentTemplate.questionJson.replace(/"isRequired":true/g, '"isRequired":false'));
        this.surveyItem = new Survey.Model(this.json);
        this.surveyItem.mode = 'display';
        this.renderAssessment()
        if (partiallyCompleted === 'true') {
          this.completeAssessmentsService.getCompletedAssessment(this.assessmentTemplateUserId, this.assessmentTemplateId).subscribe(
            answerData => {
              const answerJson = JSON.parse(answerData.answerJson);
              this.surveyItem.data = answerJson;
            }
          )
        }
      },
      err => console.error(err),
    );
  }

  setCompletedAssessment() {
    this.completeAssessmentsService.getCompletedAssessment(this.assessmentTemplateUserId, this.assessmentTemplateId).subscribe(
      answerData => {
        this.updatedDate = answerData.updatedDate;
        this.updatedBy = answerData.updatedBy;
        this.togetherModeUserName = answerData.togetherModeUserName;
        this.completeAssessmentsService.getAssessments(this.assessmentTemplateId).subscribe(
          data => {
            this.assessmentTemplate = data;
            this.assessmentName = this.assessmentTemplate.assessmentName;
            this.json = JSON.parse(data.questionJson);
            const answerJson = JSON.parse(answerData.answerJson);
            this.surveyItem = new Survey.Model(this.json);
            this.surveyItem.mode = 'display';
            this.renderAssessment();
            this.surveyItem.data = answerJson;
          },
          err => console.error(err),
        );
      },
      err => console.error(err),
    );
  }

  renderAssessment() {
    Survey.SurveyNG.render('surveyElement', {
      model: this.surveyItem,
    });

  }

  saveSurveyResponse(result) {
    const resultData = {
      userId: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId,
      userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userName,
      assessmentTemplateId: this.assessmentTemplateId,
      answerJson: result.data
    };
    this.completeAssessmentsService.saveAssessmentResult(resultData).subscribe(
      (data: any) => {
        this.snackBarService.success(`Thank you for completing the assessment!`);
        this.router.navigate(['my-assessments']);
      },
      (error: any) => {
        this.snackBarService.error(error.errorMessage);
        this.router.navigate(['my-assessments']);
      }
    );
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/assessments', this.status],  { queryParamsHandling :"merge"});
    }
}











