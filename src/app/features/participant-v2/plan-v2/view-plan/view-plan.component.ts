import { Component, Input, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Survey from 'survey-angular';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { IAssessmentTemplate } from 'src/app/features/captr-learners/view-captr-learner/complete-assessments/assessment.interface';
import { CompleteAssessmentsService } from 'src/app/features/captr-learners/view-captr-learner/complete-assessments/complete-assessments.service';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { PlanV2Service } from '../plan-v2.service';
import * as SurveyCore from "survey-core";
import {  FlatQuestion, FlatRepository, IDocOptions, PdfBrick, SurveyPDF } from "survey-pdf";

import { Model, StylesManager } from 'survey-core';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',
  styleUrls: ['./view-plan.component.scss']
})
export class ViewPlanComponent implements OnInit {

  fname: string;
  lname: string;
  prn: string;
  userId: string;
  json;
  assessmentTemplate;
  updatedDate;
  updatedBy;
  assessmentName;
  assessmentName2;
  surveyItem;
  isCompleted: string = 'false';
  partiallyCompleted;
  assessmentTemplates: IAssessmentTemplate[];
  filteredAssessmentTemplate: IAssessmentTemplate[];
  private assessmentTemplateId: any;
  private assessmentTemplateUserId: any;
  noAssessmentMessage = 'Ups! The requested assessment is not available.';
  status: any;
  pageIndex: any;
  togetherModeUserName;
  profileUrl;
  panelOpenState = true;
  reviewData: any;
  coursesColumns: string[] = ['action', 'comment', 'personResponsible', 'goalActivityType', 'status',];
  goalsList;
  json2;
  length2 = 0;
  model: Model;
  assessmentTemplate1;
  surveyItem1;
  title='';
  constructor(
    private readonly completeAssessmentsService: CompleteAssessmentsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly palnv2Service: PlanV2Service,
    private readonly participantV2Service: PlanV2Service,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    if (this.profileUrl === 'person-supported') {
      this.title = 'Plan';
  } else {
      this.title = 'Assessment';  
  }
    this.setTitle();
    Survey.ChoicesRestfull.onBeforeSendRequest = (function(sender, options) {
      // Modify the options object to include custom headers or other modifications
      options.request.setRequestHeader("X-Authorization", "Bearer " + localStorage.getItem('token'));
  });
  
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
    // StylesManager.applyTheme("defaultV2");
    this.route.queryParams.subscribe((param: any) => {
      this.pageIndex = param.pageIndex;
      this.status = param.status;
    })
    this.getUserAssessmentJsons();
    this.getReviewDetails();
    this.getGoalsData();
    this.getFeedBackAssessment();
  }

  getUserAssessmentJsons() {
    this.route.queryParams.subscribe((params: any) => {
      this.assessmentTemplateId = params.assessmentTemplateId;
      this.assessmentTemplateUserId = params.assessmentTemplateUserId;
      this.isCompleted = params.isCompleted;
      this.partiallyCompleted = params.isPartiallyCompleted;
      if (params.isCompleted === 'Completed') {
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
        this.completeAssessmentsService.getCompletedAssessment(this.assessmentTemplateUserId, this.assessmentTemplateId).subscribe(
          answerData => {
            const answerJson = JSON.parse(answerData.answerJson);
            this.surveyItem.data = answerJson;
          }
        )
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
    this.router.navigate([this.profileUrl + '/plan-v2'], { queryParamsHandling: "merge" });
  }

  getReviewDetails() {
    this.completeAssessmentsService.getReviewListData(this.assessmentTemplateUserId).subscribe(
      data =>{
        this.reviewData = data;
      }
    )
  }

  getGoalsData() {
    this.palnv2Service.getGoalsActionByAssessmentTemplateUserId(this.assessmentTemplateUserId).subscribe(data => {
      this.goalsList = data;
    })
  }

  getFeedBackAssessment() {
    this.palnv2Service.getFeedbackAssessments(this.assessmentTemplateId,this.assessmentTemplateUserId).subscribe(
      data => {
        this.assessmentTemplate1 = data;
        const json = JSON.parse(data.reviewFeedbackJson);
        const answerJson = JSON.parse(data.reviewFeedbackAnsJson);
        this.surveyItem1 = new Survey.Model(json);
        this.surveyItem1.mode = 'display';
        this.surveyItem1.data = answerJson;
        this.renderAssessment1();
       
      },
      err => console.error(err),
    );
  }


  renderAssessment1() {
    Survey.SurveyNG.render('surveyElement2', {
      model1: this.surveyItem1,
    });

  }
}
