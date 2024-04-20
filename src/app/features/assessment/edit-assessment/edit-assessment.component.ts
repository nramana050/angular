import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AssessmentService } from '../assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { surveyLocalization, Action, Serializer } from "survey-core";
import * as widgets from 'surveyjs-widgets';
import { AssessmentsCustomLocalisations } from '../assessment.en.localisation';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import * as SurveyCore from "survey-core";
import { StylesManager, SurveyCreatorModel } from "survey-creator-core";
import { init as initCustomWidget } from "../customwidget";
import { log } from 'console';
import { SchemaDefinition } from '../schemaDefinition.model';
import { InPageNavService } from '../../shared/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { forkJoin, throwError } from 'rxjs';
import { ContentManagementService } from '../../content-management/content-management.service';
import { catchError } from 'rxjs/operators';


// const defaultQuestionTypes = [ 'paneldynamic','panel','file','text','checkbox','dropdown', 'radiogroup','rating', 'imagepicker', 'expression', 'html', 'comment', widgets.bootstrapslider(SurveyKo)];
const defaultQuestionTypes = ['paneldynamic', 'panel', 'file', 'text', 'checkbox', 'dropdown', 'radiogroup', 'rating',
  'imagepicker','image', 'expression', 'html', 'comment'];

// StylesManager.applyTheme("defaultV2");
initCustomWidget(SurveyCore);
widgets.ckeditor(SurveyCore);
widgets.jquerybarrating(SurveyCore);
Serializer.addProperty("survey", {
  name: "PrePopulationApiUrl",
  category: "general",
  visibleIndex: 2
});


const editorOptions = {
  showEmbededSurveyTab: false,
  generateValidJSON: true,
  showJSONEditorTab: false,
  showPropertyGrid: false,
  showTestSurveyTab: false,
  questionTypes: defaultQuestionTypes
};

@Component({
  selector: 'app-edit-assessment',
  templateUrl: './edit-assessment.component.html',
  styleUrls: ['./edit-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EditAssessmentComponent implements OnInit, AfterViewInit, OnDestroy {
  editor: SurveyCreatorModel;
  json;
  surveyItem;
  mainCatList: Array<any>;
  assessmentTemplate;
  private assessmentTemplateId: any;
  data:SchemaDefinition;
  assessmentType: any;
  definitionId: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly assessmentService: AssessmentService,
    private readonly snackBarService: SnackBarService,
    private readonly assessmentsCustomLocalisations: AssessmentsCustomLocalisations,
    private readonly _onConfirmService: AppConfirmService,
    private readonly inPageNavService: InPageNavService,
    private readonly contentService: ContentManagementService,
  ) { }

  ngOnInit() {
    let options = { showEmbededSurveyTab: true, generateValidJSON: true,haveCommercialLicense:true };
    this.editor = new SurveyCreatorModel(
      options
    );
    // this.loadCkEditorScript();
    // console.log(this.editor.createIActionBarItemByClass);
   
    
  }

  ngOnDestroy(): void {
    this.unloadCkEditorScript();
    this.inPageNavService.setNavItems(null);
  }

  ngAfterViewInit() {
    this.getAssessmentJson();
     
   

  }

  getDataOfFormsDefinitions() {
    this.assessmentService.getSchemaDefinitions().subscribe(data => {
      data.forEach(element => {
        if (element.assessmentTemplateId == this?.assessmentTemplateId) {
          this.definitionId = element.id;
          console.log("defination Id....", this.definitionId)
        }
      });
    });
  }

  getAssessmentJson() {
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('assessmentTemplateId')) {
        this.assessmentTemplateId = params['assessmentTemplateId'];
        forkJoin([
          this.assessmentService.getAssessment(this.assessmentTemplateId),
          this.contentService.getMainCategories()
        ])
          .pipe(
            catchError(error => {
              console.error('Error in forkJoin:', error);
              // Handle the error as needed
              return throwError(error);
            })
          )
          .subscribe(
            data => {
              console.log("after forkJoin");
              this.assessmentTemplate = data[0];
              let categories: any = data[1];
              let catData = [];
              for (let i = 0; i < categories.length; i++) {
                const item = categories[i];
                const val = item.id;
                catData.push({ value: val, text: item.categoryName });
              }
              catData.push({ value: "", text: "Select" });
              this.mainCatList = catData;
              this.json = JSON.parse(this.assessmentTemplate.questionJson);
            },
            error => this.snackBarService.error(error.error.applicationMessage),
            () => { this.renderEditAssessment(this.json); }
          );     
        
      } else {
        this.renderEditAssessment(this.json);
      }
    });
  }


  renderEditAssessment(json) {
    this.modifyQuestionsConfig();
    surveyLocalization.locales["fr"];
    // SurveyCreator.localization.currentLocale = "fr";

    surveyLocalization.locales['en_uk'] = this.assessmentsCustomLocalisations.enUKStrings;
    // surveyLocalization.locales = 'en_uk';

    SurveyCore.JsonObject.metaData.addProperty("itemvalue", { name: "score:number" });

    Serializer.addProperty('itemvalue', {
      name: 'score',
      type: "number",
      category: 'general',
    });

 //   SurveyEditor.SurveyQuestionEditorDefinition.definition[
 //     'itemvalue[]@choices'
 //   ].properties.push('score');



    this.editor = new SurveyCreatorModel(
      editorOptions
    );
    // this.editor = new SurveyEditor.SurveyEditor(
    //   'surveyEditorContainer',
    //   editorOptions
    // );

    // SurveyEditor.SurveyPropertyModalEditor.registerCustomWidget(
    //   'html',
    //   ckEditorModal
    // );

    SurveyCore.JsonObject.metaData.addProperty('page', 'popupdescription:text');
    this.assessmentType=json?.pages[0].elements[0].defaultValue;
    
    this.editor.text = JSON.stringify(json);
    this.editor.saveSurveyFunc = this.onSaveAssessment;

    this.editor.toolbar.actions.push(new Action({
      id: 'back_button',
      title: 'Exit',
      visible: true,
      enabled: true,
      action: () => this.router.navigate(['./assessment-builder/'])
    }));


    // });
    // this.editor.toolbarItems.push({
    //   id: 'back_button',
    //   visible: true,
    //   title: 'Exit',
    //   action: () => this.router.navigate(['./assessment-builder/'])
    // });
   console.log("assessment type..", this.assessmentType);
    if(this.assessmentType != null) {
      this.getDataOfFormsDefinitions();
    }

  }

  onSaveAssessment = () => {
    const obj = {
      template: JSON.parse(this.editor.text),
      userName: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).fullName,
      assessmentTemplateId: this.assessmentTemplateId,
      assessmentType: this.assessmentType,
      definitionId: this.definitionId
    };
    let isScoreElementAvailable = false;
    const questions = JSON.parse(this.editor.text);
    const keys = Object.keys(questions);
    keys.forEach(element => {
      if ('pages' === element) {
        const pages = questions.pages;
        pages.forEach(page => {
          const elements = page.elements;
          elements.forEach(question => {
            if (question.type === 'expression' && 'score' === question.name) {
              isScoreElementAvailable = true;
            }
          })
        });
      }
    });

    if (!isScoreElementAvailable) {
      const dialogRef = this._onConfirmService.confirm({
        title: `Scoring expression not selected`,
        message: `You have not selected scoring element, do you want to continue without scoring expression?`,
        okButtonName: 'Yes',
        cancelButtonName: 'No'
      });

      dialogRef.subscribe(output => {
        if (output) {
          this.saveTemplate(obj);
        }
      });
    } else {
      this.saveTemplate(obj);
    }
  }

  saveTemplate(obj) {
    if (JSON.stringify(obj.template !== JSON.stringify(this.json))) {
      this.assessmentService.createAssessment(obj).subscribe(
        (data: any) => {
          if (obj.assessmentTemplateId) {
            this.snackBarService.success('Asset Template Updated!');
          } else {
            this.snackBarService.success('Asset Template Saved!');
          }

          this.router.navigate(['./assessment-builder/']);
        },
        (error: any) => {
          this.snackBarService.error(error.error.applicationMessage);
        }
      );
    } else {
      this.snackBarService.error('No updates to save!');
    }
  }

  modifyQuestionsConfig() {
    //Add a tag property to all questions
    Serializer.addProperty("question",
      {
        name: "isRecommended",
        category: "Recommendation",
        type: "boolean"
      });
    Serializer.addProperty("question",
      {
        name: "linkedMainCategory",
        category: "Recommendation",
        dependsOn: ["isRecommended"],
        visibleIf: function (obj) {
          if(!obj.isRecommended){
            obj.linkedMainCategory="";
          }
          return obj.isRecommended;
        },
        choices: this.mainCatList
      });
    // Change the order of name and title properties, remove the startWithNewLine property and add a tag property
    // SurveyEditor.SurveyQuestionEditorDefinition.definition["question"].properties =
    //   ["title", "name", { name: "tag", title: "Tag" }, { name: "visible", category: "checks" }, { name: "isRequired", category: "checks" }];
  }



  private unloadCkEditorScript() {
    [].slice.call(document.querySelectorAll('script'), 0)
      .filter(script => script.src.includes('ckeditor'))
      .forEach(script => script.parentNode.removeChild(script));
  }

}

