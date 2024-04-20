import { Component, Input, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { IAssessmentTemplate } from '../../complete-assessments/assessment.interface';
import { CompleteAssessmentsService } from '../../complete-assessments/complete-assessments.service';
import { Model, StylesManager } from 'survey-core';
import * as SurveyCore from "survey-core";
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ChartComponent,
  ApexStroke,
  ApexPlotOptions,
  ApexYAxis,
  ApexMarkers
} from "ng-apexcharts";
import { PerformanceReviewService } from '../performance-review.service';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

widgets.bootstrapslider(Survey);

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: any;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  yaxis: ApexYAxis;
  markers: ApexMarkers;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-view-performance-review-assessment',
  templateUrl: './view-performance-review-assessment.component.html',
  styleUrls: ['./view-performance-review-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ViewPerformanceReviewAssessmentComponent implements OnInit, OnDestroy {

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
  pageIndex: any;
  togetherModeUserName;

  @ViewChild('model') surveyModel: Model;
  assessmentTemplateType: any;
  bodyparts: { value: string; text: string; }[];

  roleDetails: any[];

  objName: any[] = [];
  objEmprating: any[] = [];
  objManagerrating: any[] = [];

  skillEmprating: any[] = [];
  skillName: any[] = [];
  skillManagerrating: any[] = [];

  public chartOptions: Partial<ChartOptions>;
  public chartSkillOptions: Partial<ChartOptions>;
  assessmentResult: any;

  chartData: any[];
  chartType: string = 'bar';
  newAnswerData: any;
  isAssessPartiallyCompleted: any;
  isAssessCompleted: any;
  isAssessStaffCompleted: any;
  isassessStaffPartially: any;
  flag: boolean;
  profileUrl;

  chartWidth: string = '100%';
  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef;

  constructor(
    private readonly completeAssessmentsService: CompleteAssessmentsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly performanceReviewService: PerformanceReviewService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
  }

  setTitle() {
    this.route.snapshot.parent.data['title'] = '';
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.fname = params.name;
        this.userId = params.id;
        this.isAssessCompleted = params.isCompleted;
        this.isAssessPartiallyCompleted = params.isPartiallyCompleted;
        this.isAssessStaffCompleted = params.isStaffCompleted;
        this.isassessStaffPartially = params.isStaffPartiallyCompleted;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
    this.checkHexOnStatus(this.isAssessCompleted, this.isAssessPartiallyCompleted, this.isAssessStaffCompleted, this.isassessStaffPartially);
  }
  checkHexOnStatus(isAssessCompleted: any, isAssessPartiallyCompleted: any, isAssessStaffCompleted: any, isassessStaffPartially: any) {
    if (isAssessCompleted === 'true') {
      if (isAssessStaffCompleted === 'true') {
        return this.flag = true;
      }
      return this.flag = false;
    }
    else {
      return this.flag = false;
    }
  }

  ngOnInit() {
    StylesManager.applyTheme("defaultV2");
    SurveyCore.ChoicesRestfull.onBeforeSendRequest = function (sender, options) {
      options.request.setRequestHeader("X-Authorization", "Bearer " + localStorage.getItem('token'));
    };
    this.route.queryParams.subscribe((param: any) => {
      this.pageIndex = param.pageIndex;
    })
    this.getUserAssessmentJsons();
    this.performanceReviewHexPlot();
    this.calculateChartWidth();
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
    })
  }

  setNewAssessment(partiallyCompleted) {
    this.completeAssessmentsService.getAssessments(this.assessmentTemplateId).subscribe(
      data => {
        this.assessmentTemplate = data;
        this.assessmentName = this.assessmentTemplate.assessmentName;
        this.json = JSON.parse(this.assessmentTemplate.questionJson.replace(/"isRequired":true/g, '"isRequired":false'));
        this.surveyModel = new Model(this.json);
        this.surveyModel.mode = 'display';
        this.renderAssessment()
        if (partiallyCompleted === 'true') {
          this.completeAssessmentsService.getCompletedAssessment(this.assessmentTemplateUserId, this.assessmentTemplateId).subscribe(
            answerData => {
              const answerJson = JSON.parse(answerData.answerJson);
              this.surveyModel.data = answerJson;
            })
        }
      },
      err => console.error(err),
    );
  }

  setCompletedAssessment() {
    this.completeAssessmentsService.getCompletedAssessment(this.assessmentTemplateUserId, this.assessmentTemplateId).subscribe(
      answerData => {
        this.newAnswerData = answerData;
        this.updatedDate = answerData.updatedDate;
        this.updatedBy = answerData.updatedBy;
        this.togetherModeUserName = answerData.togetherModeUserName;
        this.completeAssessmentsService.getAssessments(this.assessmentTemplateId).subscribe(
          data => {
            this.assessmentTemplateType = data.refAssessment?.identifier;
            this.assessmentTemplate = data;
            this.assessmentName = this.assessmentTemplate.assessmentName;
            this.json = JSON.parse(data.questionJson);
            const answerJson = JSON.parse(answerData.answerJson);
            this.surveyModel = new Model(this.json);
            this.surveyModel.mode = 'display';
            this.renderAssessment();
            this.surveyModel = new Model(this.json);
            this.surveyModel.data = answerJson;
            let obj = { ...this.surveyModel.data };
            if (this.assessmentTemplateType.includes('SU_PR')) {
              for (let page of this.json.pages) {
                for (let ele of page['elements']) {
                  if (ele.columnName) {
                    for (let instance in ele) {
                      if (instance === 'choices') {
                        for (const iterator of ele[instance]) {
                          for (const key in answerJson) {
                            if (ele.name == key) {
                              obj[`${ele.name}`] = iterator.value;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            const choicesData: { value: string, text: string }[] = [];
            if (this.assessmentTemplateType.includes('SU_PR')) {
              for (let page of this.json.pages) {
                for (let ele of page['elements']) {
                  if (ele.title === 'Body Map') {
                    const templateElementsArray = ele.templateElements;
                    const question1Array = this.surveyModel.data.question1;
                    for (let item of question1Array) {
                      const question2Value = item.question2;
                      for (const element of templateElementsArray) {
                        if (element.choices) {
                          const choicesArray = element.choices;
                          for (const choice of choicesArray) {
                            if (choice.value === question2Value) {
                              choicesData.push(choice);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            this.bodyparts = choicesData;
            setTimeout(() => {
              for (let i = 0; i < this.bodyparts.length; i += 1) {
                document.getElementsByClassName(this.bodyparts[i].text)[0]['style'].display = 'inline-block';
              }
            }, 200);

            this.surveyModel.data = obj
            this.surveyModel.mode = 'display';
            this.renderAssessment();

          },
          err => console.error(err),
        );
      },
      err => console.error(err),
    );
  }

  renderAssessment() {
    setTimeout(() => {
      const inputField = document.querySelector('.sd-navigation__next-btn');
      inputField.addEventListener('click', function () {
        window.scrollTo(0, 0);
      });
    }, 100);
    Survey.SurveyNG.render('surveyElement', {
      model: this.surveyModel,
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
    this.router.navigate([this.profileUrl+'/performance-review'],  { queryParamsHandling :"merge"});
  }

  performanceReviewHexPlot() {
    this.objEmprating = [];
    this.skillEmprating = [];
    this.objName = []
    this.skillName = [];
    this.objManagerrating = [];
    this.skillManagerrating = [];
    this.performanceReviewService.getPeformanceReviewScore(this.assessmentTemplateUserId).subscribe(result => {
      result.forEach(x => {
        if (x.question.includes('Obj')) {
          this.objEmprating.push(x.employeeRating);
          this.objName.push(x.tittle);
          this.objManagerrating.push(x.managerRating);
        }
        else if (x.question?.includes('Comp') || x.question.includes('Skill')) {
          this.skillEmprating.push(x.employeeRating);
          this.skillName.push(x.tittle);
          this.skillManagerrating.push(x.managerRating)
        }
      })
      this.spiderChart();
    })
  }

  private spiderChart() {
    this.chartOptions = {
      series: [
        {
          name: "Employee rating",
          data: this.objEmprating
        },
        {
          name: "Manager rating",
          data: this.objManagerrating
        }
      ],
      chart: {
        height: 320,
        width: this.chartWidth,
        type: "radar"
      },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        radar: {
          size: 90,
          polygons: {
            fill: {
              colors: ["#eee", "#fff"]
            }
          }
        }
      },
      title: {
        text: "Objectives_" + this.fname,
        style: {
          fontSize: '19px',
          fontWeight: 'bold',
          color: '#263238',
          fontFamily: 'Roboto'
        },
      },
      colors: ["#7C2855", "#004A8F"],
      markers: {
        size: 6,
        colors: ["#fff"],
        strokeColors: ["#005EB8"],
        strokeWidth: 2
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: ["#85994b", "#85994b", "#85994b", "#85994b", "#85994b", "#85994b"],
            fontFamily: 'Roboto'
          }
        },
        categories: this.objName
      },
      yaxis: {
        tickAmount: 5,
        min: 0,
        max: 5
      }
    };
    this.chartSkillOptions = {
      series: [
        {
          name: "Employee rating",
          data: this.skillEmprating
        },
        {
          name: "Expected score",
          data: this.skillManagerrating
        }
      ],
      chart: {
        height: 320,
        width: this.chartWidth,
        type: "radar"
      },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        radar: {
          size: 90,
          polygons: {
            fill: {
              colors: ["#eee", "#fff"]
            }
          }
        }
      },
      title: {
        text: "Skills And Competencies_" + this.fname,
        style: {
          fontSize: '19px',
          fontWeight: 'bold',
          color: '#263238',
          fontFamily: 'Roboto'
        },
      },
      colors: ["#7C2855", "#004A8F"],
      markers: {
        size: 6,
        colors: ["#fff"],
        strokeColors: ["#005EB8"],
        strokeWidth: 2
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: ["#f47738", "#f47738", "#f47738", "#5694ca", "#5694ca", "#5694ca"],
            fontFamily: 'Roboto'
          }
        },
        categories: this.skillName
      },
      yaxis: {
        tickAmount: 5,
        min: 0,
        max: 5
      }
    };
  }

  calculateChartWidth() {
    this.setChartWidth();
    window.addEventListener('resize', () => this.setChartWidth());
  }

  setChartWidth() {
    const containerWidth = this.chartContainer?.nativeElement?.offsetWidth;
    this.chartWidth = containerWidth > 400 ? `${containerWidth}px` : '100%';
  }

}

