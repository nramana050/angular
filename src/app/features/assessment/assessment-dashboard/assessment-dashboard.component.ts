import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AssessmentService } from '../assessment.service'
import { ActivatedRoute } from '@angular/router';
import { VisualizationPanel } from 'survey-analytics';
import { Model } from 'survey-core';

const vizPanelOptions = { allowHideQuestions: false, haveCommercialLicense:true };

@Component({
  selector: 'app-assessment-dashboard',
  templateUrl: './assessment-dashboard.component.html',
  styleUrls: ['./assessment-dashboard.component.scss']
})
export class AssessmentDashboardComponent implements OnInit, AfterViewInit {

  Id: any;
  assesmentData:any;
  assesmentTemplateData: Object = {};
  assesmentResponseData: any = [];
  @ViewChild("surveyVizPanel") elem: ElementRef | undefined;

  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.params.subscribe(param => {
      this.Id = param['id']
    })
  }

  ngAfterViewInit(): void { }

  ngOnInit(): void {

    this.getAssessmentData();
  }

  getAssessmentData(){

    this.assessmentService.getAssessmentTemplateAnswersById(this.Id).subscribe(data => {
      if(data){
        this.prepareData(data);
      }
    }, err =>{ 
    })
  }

  prepareData(assessmentData: any){

    this.assesmentTemplateData = JSON.parse(assessmentData?.['assessmentTemplate']);
    let len = assessmentData?.assessmentResponses.length;
    for (let i = 0; i < len; i+=1) {
      this.assesmentResponseData.push(JSON.parse(assessmentData?.assessmentResponses[i]));  
    }
    this.prepareSurveyData();
  }

 async prepareSurveyData(){

    // let surveyTemplateData = await this.filterVisualizedQuestion(this.assesmentTemplateData);
    let surveyTemplateData = this.assesmentTemplateData;
    const survey = new Model(surveyTemplateData);
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      this.assesmentResponseData,
      vizPanelOptions
    );
    vizPanel.render(this.elem?.nativeElement); 

    // let firstSurveyDoc = document.getElementsByClassName('sa-panel__header')[0];
    // firstSurveyDoc.removeChild(firstSurveyDoc.firstChild);
  }

  filterVisualizedQuestion(survey: any): any {

    return new Promise( resolve =>{

        let surveysLen = survey.pages.length;
        for (let i = 0; i < surveysLen; i+=1) { 
            let surveyElements = survey.pages[i]?.elements;
            if(surveyElements){
                const questions = surveyElements;
                const isVisualizedFilter = (question: any) => {
                return question["isVisualized"] ? true : false;
                };
                const visualizedQuestions = questions.filter(isVisualizedFilter);
                survey.pages[i].elements = visualizedQuestions;
            } 
            if(i == surveysLen - 1){
                resolve(survey)
            }
        }
    })
  }
}
