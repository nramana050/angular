import { AfterViewInit, Component, Input, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../assessment.service';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import { Model, StylesManager } from 'survey-core';
import * as SurveyCore from "survey-core";
import { log } from 'console';

widgets.bootstrapslider(Survey);

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrls: ['./view-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ViewAssessmentComponent implements OnInit {

  json;
  surveyItem;
  assessmentTemplate;
  assessmentName;
  assessmentTemplateId: any;
  isCompleted: boolean = false;
  private score: number = 0;
  @ViewChild('model') surveyModel: Model;
  @Output() submitSurvey = new EventEmitter<any>();
  result: any;
  model: Model;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly assessmentService: AssessmentService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    StylesManager.applyTheme("defaultV2");
    SurveyCore.ChoicesRestfull.onBeforeSendRequest = function (sender, options) {
      options.request.setRequestHeader("X-Authorization", "Bearer " + localStorage.getItem('token'));
    };
    this.getAssessmentJson();
  }

  getAssessmentJson() {
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('assessmentTemplateId')) {
        this.assessmentTemplateId = params['assessmentTemplateId'];
        this.assessmentService.getAssessment(this.assessmentTemplateId).subscribe((data: any) => {
          this.assessmentTemplate = data;
          this.assessmentName = this.assessmentTemplate.assessmentName;
          this.json = JSON.parse(this.assessmentTemplate.questionJson);
          this.surveyModel = new Model(this.json);
          this.surveyModel.onLoadChoicesFromServer.add(function (sender, options) {
            if (options.question.name == "Roleaspiration") {
              sender.getQuestionByName("Roleaspiration").value = options.serverResult[0]?.name
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
        },
          err => console.error(err),
          () => this.renderDummyAssessment()
        );
      }
    });
  }

  renderDummyAssessment() {
    Survey.JsonObject.metaData.addProperty("itemvalue", { name: "score:number" });
    Survey.SurveyNG.render('surveyElement', {
      model: this.surveyModel
    });
  }

  verifySurveyResponse(result) {
    this.score = 0;
    if (!result.surveyModel.checkIsCurrentPageHasErrors()) {
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

  print() {
    window.print();
  }
}
