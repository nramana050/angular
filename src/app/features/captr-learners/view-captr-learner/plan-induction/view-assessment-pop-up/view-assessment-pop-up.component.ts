import { Component, Inject, OnInit } from '@angular/core';
import * as Survey from 'survey-angular';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-assessment-pop-up',
  templateUrl: './view-assessment-pop-up.component.html',
  styleUrls: ['./view-assessment-pop-up.component.scss']
})
export class ViewAssessmentPopUpComponent implements OnInit {

  fname: string;
  userId: string;
  json;
  surveyItem;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit() {
    this.setCompletedAssessment();
  }

  setCompletedAssessment() {
    this.fname = this.data.firstName;
    this.data.assessmentQuestionData.assessmentTemplateId
    this.json = JSON.parse(this.data.assessmentQuestionData.questionJson);

    const answerJson = JSON.parse(this.data.answerData.answerJson);
    this.surveyItem = new Survey.Model(this.json);
    this.surveyItem.mode = 'display';
    this.renderAssessment();
    this.surveyItem.data = answerJson;
  }

  renderAssessment() {
    Survey.SurveyNG.render('surveyElement', {
      model: this.surveyItem,
    });

  }
}
