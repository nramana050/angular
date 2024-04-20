import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RiskAssessmentService} from './../risk-assessment/risk-assessment.service'
import { ParticipantV4Service } from '../../participant-v4.service';

@Component({
  selector: 'app-risk-assessment-history',
  templateUrl: './risk-assessment-history.component.html',
  styleUrls: ['./risk-assessment-history.component.scss']
})
export class RiskAssessmentHistoryComponent implements OnInit {

  _visible: boolean;
  suId: any;
  riskAssessmentHistoryData: any;
  newElement: any;
  newArray;
  newArray1=[];
  allData;
  answerName2=[];
  answerName3=[];
  answerName4;
  answerName5;
  answerName6;
  answerName7;
  reversedObjectList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private readonly renderer: Renderer2,
    private readonly riskAssessmentService: RiskAssessmentService,
    private readonly participantV4Service: ParticipantV4Service
  ) {
    this.getAlldeatils();
   }

  ngOnInit(): void {
    this.getRiskAssessmentHistory()

  }

  async getAlldeatils(){
    await  this.participantV4Service.getRefDataAllDetails().toPromise().then((data:any) => {
      this.allData = data;
          })
        }

  getRiskAssessmentHistory() {
    this.riskAssessmentService.getRiskAssessmentHistory(this.data).subscribe(data => {
      this.riskAssessmentHistoryData = data;
      
      this.riskAssessmentHistoryData.forEach(riskAssessmentHistory =>{
        const ids = riskAssessmentHistory.riskFromGraduateIds;
        this.answerName2 =[];
        this.answerName3 =[];
        
        if (ids.length > 0) {
             ids.forEach(id => {
              
           const filteredChoiceListArr = this.allData?.refDataMap?.Risk_From_Graduate?.filter(choice => choice.id === id);
           const choiceList = filteredChoiceListArr[0];
           if (choiceList) {
             this.answerName2.push(choiceList.description);
          }
         })
         riskAssessmentHistory['answer2']=this.answerName2;
       }

       const groupPublicRiskIds = riskAssessmentHistory.groupPublicRiskIds;

       if(groupPublicRiskIds != null && groupPublicRiskIds.length> 0){
        groupPublicRiskIds.forEach(id => {
          const filteredChoiceListArr = this.allData?.refDataMap?.Public_At_Risk?.filter(choice => choice.id === id);
          const choiceList = filteredChoiceListArr[0];
          if (choiceList && choiceList.id == 894) {
            this.answerName3.push(riskAssessmentHistory.othrPublicRisk);
         }else {
          this.answerName3.push(choiceList.description);
         }
        })
        riskAssessmentHistory['answer3']=this.answerName3;
       } 
       this.getGradauteMappa(riskAssessmentHistory.graduateMAPPA);
       this.getMappaCategories(riskAssessmentHistory.mappaCategory);
       this.getMappaLevel(riskAssessmentHistory.mappaLevel);
       this.getIsSexualoffendingHistory(riskAssessmentHistory.isSexualOffendingHistory);
      })
      this.reversedObjectList = this.riskAssessmentHistoryData?.slice().reverse();

    })
  }

  close() {
    this.hide();
  }

  hide(event?: Event) {
    this.visible = false;
    this.renderer.removeClass(document.body, 'modal-open');
  }

  get visible(): boolean {
    document.getElementById('myModalLabel').onkeydown = function (e) {
      if ((e.which === 9) && (e.shiftKey === true)) {
        e.preventDefault(); // so that focus doesn't move out.
        document.getElementById('last').focus();
      }
    }
    const lastElement = document.getElementById('last');
    if (lastElement) {
      lastElement.onkeydown = function (e) {
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault();
          document.getElementById('myModalLabel').focus();
        }
      }
    }
    return this._visible;
  }

  set visible(val: boolean) {
    this._visible = val;
    if (this._visible) {
      (function () {
        document.getElementById('myModalLabel').focus();
      })();
      this.renderer.addClass(document.body, 'modal-open');
      const a = document.getElementById('myModalLabel');
      setTimeout(function () { a.focus(); }, 10);
    }
  }


  getans1(id){
    const filteredGraduateLevelriskArr = this.allData?.refDataMap?.Graduates_Level_Risk.filter(choice => choice.id === id);
    const choiceList = filteredGraduateLevelriskArr[0];
    return choiceList?.description;
  }

  getGradauteMappa(graduateMAPPA) {
    const filteredGraduateLevelriskArr = this.allData?.refDataMap?.Status_Yes_No.filter(choice => choice.id === graduateMAPPA);
    const choiceList = filteredGraduateLevelriskArr[0];
    this.answerName4 = choiceList?.description;
  }
  
  getMappaCategories(id){
    const filteredGraduateLevelriskArr = this.allData?.refDataMap?.MAPPA_Category_Level.filter(choice => choice.id === id);
    const choiceList = filteredGraduateLevelriskArr[0];
    this.answerName5 = choiceList?.description;
  }

  getIsSexualoffendingHistory(id){
    const filteredGraduateLevelriskArr = this.allData?.refDataMap?.Status_Yes_No.filter(choice => choice.id === id);
    const choiceList = filteredGraduateLevelriskArr[0];
    this.answerName7 = choiceList?.description;
  }

  getMappaLevel(id){
    const filteredGraduateLevelriskArr = this.allData?.refDataMap?.MAPPA_Category_Level.filter(choice => choice.id === id);
    const choiceList = filteredGraduateLevelriskArr[0];
    this.answerName6 = choiceList?.description; 
  }

}