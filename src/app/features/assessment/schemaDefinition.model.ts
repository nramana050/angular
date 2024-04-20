import { SurveyCreatorModel } from "survey-creator-core";

export class SchemaDefinition{

   id?:string;
   definition:SurveyCreatorModel;
   assessmentTemplateName:string;
   refAssessment:string;
   assessmentTemplateId:Number;
   createdDate?:Date;
   createdBy?:string;
   updatedDate?:Date;
   updatedBy?:string;
   assessmentType:string

}