import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { RiskAssessmentService } from './risk-assessment.service';
import { ParticipantV4Service } from '../../participant-v4.service';
import { RiskAssessmentHistoryComponent } from '../risk-assessment-history/risk-assessment-history.component';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-risk-assessment',
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss']
})

export class RiskAssessmentComponent implements OnInit {
  suId: number;
  name: string;
  SU: string;
  id: number;
  prn: any;
  riskForm: FormGroup;
  riskAssessData: any;
  answerName1;
  answerName2 = [];
  answerName3= [];
  answerName4;
  answerName5;
  answerName6;
  answerName7;
  riskHistoryList: any;
  versionCount: any;
  roleId: any;
  showbuttonEdit: boolean = false;
  loggedInUserName: any;
  todayDate: Date;
  firstName: any;
  profileUrl;
  allData;  
  countFlag: boolean= false;


  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly riskAssessmentService: RiskAssessmentService,
    private readonly dialog: MatDialog,
    private readonly sessionService: SessionsService,
    private readonly participantV4Service :ParticipantV4Service
  ) {
  
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu1);  
    this.setTitle();
   this.getAlldeatils();
    this.riskAssessmentService.getRefRiskAssessmentData().subscribe(data => {
      this.fetchRiskAssessment();
      this.getRiskAssessmentHistoryVersions();
    });
  }

  ngOnInit(): void {
    this.loggedInUserName =  JSON.parse(atob(localStorage.getItem('token').split('.')[1])).name;
    this.firstName = this.loggedInUserName?.split(' ')[0];
    this.roleId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
    this.showbuttonEdit = true;
    this.todayDate = new Date();
  }
  async getAlldeatils(){
    await  this.participantV4Service.getRefDataAllDetails().toPromise().then((data:any) => {
      this.allData = data;
          })
        }


  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.SU = params.SU;
      this.suId = params.id;
      this.prn = params.prn;
      this.route.snapshot.data.title = `${this.name}`;
    });
  }

  onEditClicked() {
    this.router.navigate([this.profileUrl+'/risk-assessment/edit-risk-assessment'],  { queryParamsHandling :"merge"});
  }

  onRiskDocument() {
    this.router.navigate([this.profileUrl+'/risk-assessment/risk-assessment-document'],  { queryParamsHandling :"merge"});
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }

  fetchRiskAssessment() {
    this.riskAssessmentService.fetchRiskAssessment(this.suId).subscribe(data => {
      this.countFlag=false;
      if(data){
        this.countFlag=true;
        this.riskAssessData = data;  
        this.getGraduateLevelrisk(this.riskAssessData.graduatesLevelRiskId );  
        this.getriskFromGraduates(this.riskAssessData.riskFromGraduateIds);
        this.getgroupRisk(this.riskAssessData.groupPublicRiskIds !=null ? this.riskAssessData.groupPublicRiskIds :null );
        this.getGradauteMappa(this.riskAssessData.graduateMAPPA);
        this.getMappaCategories(this.riskAssessData.mappaCategory);
        this.getMappaLevel(this.riskAssessData.mappaLevel);
        this.getIsSexualoffendingHistory(this.riskAssessData.isSexualOffendingHistory);
      }
   
    });
    window.scroll(1, 1);
  }
  getGradauteMappa(graduateMAPPA) {
    const filteredGraduateLevelriskArr = this.allData?.refDataMap?.Status_Yes_No.filter(choice => choice.id === graduateMAPPA);
    const choiceList = filteredGraduateLevelriskArr[0];
    this.answerName4 = choiceList?.description;
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

  getMappaCategories(id){
    const filteredGraduateLevelriskArr = this.allData?.refDataMap?.MAPPA_Category_Level.filter(choice => choice.id === id);
    const choiceList = filteredGraduateLevelriskArr[0];
    this.answerName5 = choiceList?.description;
  }

  getriskFromGraduates(ids) {
   if (ids.length > 0) {
        ids.forEach(id => {
      const filteredChoiceListArr = this.allData?.refDataMap?.Risk_From_Graduate?.filter(choice => choice.id === id);
      const choiceList = filteredChoiceListArr[0];
      if (choiceList) {
        this.answerName2.push(choiceList.description);
     }
    })
  }
  }

  getgroupRisk(ids){
   if( ids !==null && ids.length> 0){
    ids.forEach(id => {
      const filteredChoiceListArr = this.allData?.refDataMap?.Public_At_Risk?.filter(choice => choice.id === id);
      const choiceList = filteredChoiceListArr[0];
      if (choiceList && choiceList.id == 894) {
        this.answerName3.push(this.riskAssessData.othrPublicRisk);
     }else {
      this.answerName3.push(choiceList.description);
     }
    })
   } 
 }

  getGraduateLevelrisk(id) {
    const filteredGraduateLevelriskArr = this.allData?.refDataMap?.Graduates_Level_Risk.filter(choice => choice.id === id);
    const choiceList = filteredGraduateLevelriskArr[0];
    this.answerName1 = choiceList?.description;
  }


  getRiskAssessmentHistoryVersions() {
    this.riskAssessmentService.getRiskAssessmentHistory(this.suId).subscribe(result => {
      this.riskHistoryList = result;
      this.versionCount = this.riskHistoryList?.length;
    });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

  openDialog() {
    this.dialog.open(RiskAssessmentHistoryComponent,{
      data: this.suId,
    });
  }

  download(path){
    let blobUrl = environment.cdnUrl +path;
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.click();
      document.body.removeChild(a);
  }
}

