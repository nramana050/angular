import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../learner-nav';
import { RiskAssessmentHistoryComponent } from './risk-assessment-history/risk-assessment-history.component';
import { RiskAssessmentService } from './risk-assessment.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

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
  @ViewChild('historyRiskAssessmentModal', { static: false }) historyRiskModal: RiskAssessmentHistoryComponent;
  riskAssessData: any;
  riskAssessmentData: any[];
  riskOasysReport: any[];
  refRiskStatus: any[];
  answerName2: any;
  answerName3: any;
  answersNamesArr1 = [];
  riskHistoryList: any;
  versionCount: any;
  roleId: any;
  showbuttonEdit: boolean = false;
  answerChoiceIds: any;
  countFlag: boolean= false;
  loggedInUserName: any;
  todayDate: Date;
  firstName: any;
  profileUrl;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly riskAssessmentService: RiskAssessmentService,
    private readonly dialog: MatDialog,
    private readonly sessionService: SessionsService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu1);  
    this.setTitle();
    this.riskAssessmentService.getRefRiskAssessmentData().subscribe(data => {
      this.riskAssessmentData = data.riskTypeList;
      this.riskOasysReport = data.oasysReportList;
      this.refRiskStatus = data.riskStatusList;
      this.fetchRiskAssessment();
      this.getRiskAssessmentHistoryVersions();
    });
  }

  ngOnInit(): void {
    this.loggedInUserName =  JSON.parse(atob(localStorage.getItem('token').split('.')[1])).name;
    this.firstName = this.loggedInUserName.split(' ')[0];
    this.roleId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
    this.showbuttonEdit = true;
    this.todayDate = new Date();
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

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }

  fetchRiskAssessment() {
    this.riskAssessmentService.fetchRiskAssessment(this.suId).subscribe(data => {
      this.riskAssessData = data;
      if (data) {
        this.countFlag=true;
        this.resolveRiskTypeAnswer(data?.riskAssessmentTypeId);
        this.resolveOasysReportAnswer(data?.oasysReportId);
        this.resolveRiskStatusAnswer(data?.riskAssessmentStatusId);
      }
    });
    window.scroll(1, 1);
    this.countFlag=false;
  }

  resolveRiskTypeAnswer(answerString) {
    const parsedAnswer = JSON.parse(answerString);
    this.answerChoiceIds = parsedAnswer.ids;
    if (this.answerChoiceIds.length > 0) {
      this.answerChoiceIds.forEach(id => {
        const filteredChoiceListArr = this.riskAssessmentData?.filter(choice => choice.id === id);
        const choiceList = filteredChoiceListArr[0];
        this.answersNamesArr1.push(choiceList?.name);
      })
    }
  }

  resolveOasysReportAnswer(id) {
    const filteredChoiceListArr = this.riskOasysReport?.filter(choice => choice.id === id);
    const choiceList = filteredChoiceListArr[0];
    this.answerName2 = choiceList?.name;

  }

  resolveRiskStatusAnswer(id) {
    const filteredChoiceListArr = this.refRiskStatus?.filter(choice => choice.id === id);
    const choiceList = filteredChoiceListArr[0];
    this.answerName3 = choiceList?.name;

  }

  openDialog() {
    this.dialog.open(RiskAssessmentHistoryComponent,{
      data: this.suId,
    });
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
}
