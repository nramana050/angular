import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from '../../../../../features/shared/components/confirm-box/confirm-box.service';
import { SnackBarService } from '../../../../../framework/service/snack-bar.service';
import { ActionPlanHistoryComponent } from '../action-plan-history/action-plan-history.component';
import { PlanInductionService } from '../plan-induction.service';
import { LearnerNavigation } from '../../learner-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ViewAssessmentPopUpComponent } from '../view-assessment-pop-up/view-assessment-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { CompleteAssessmentsService } from '../../complete-assessments/complete-assessments.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-check-answer',
  templateUrl: './check-answer.component.html',
  styleUrls: ['./check-answer.component.scss']
})
export class CheckAnswerComponent implements OnInit, OnDestroy {
  
  planVersionList: any;
  userId: number;
  questionPanelFlag: any = true;
  closeAllButton: boolean = false;
  count = 0;
  userPlans: any = [];
  questionList: any = [];
  historyList:  any = [];
  starPlanData: any;
  actionList: any;
  activeGoalsList: any;
  historyGoalsList: any;
  result: any;
  actionPlanCreatedFlag: any;
  questionErrors = [];
  navigateToPage;
  showHistoryButton: boolean = false;
  changedAns : boolean = false;
  planCreatedByfirstName =[];
  activeGoals=[];
  @ViewChild('historyQuestionModal', { static: false }) historyQuesModal: ActionPlanHistoryComponent;
  checkAnswersData: any;
  fname: any;
  assessmentQuestionData;
  answerData: any;
  firstName: any;
  isAuthorized = false;
  profileUrl;
  

  constructor(
    private readonly planInductionService: PlanInductionService,
    private readonly route: ActivatedRoute,
    private readonly confirmService: ConfirmService,
    private readonly snackBarService: SnackBarService,
    private readonly renderer: Renderer2,
    private readonly router: Router,
    private readonly LearnerNavigation: LearnerNavigation,
    private readonly inPageNavService: InPageNavService,
    public  dialog: MatDialog,
    private readonly completeAssessmentsService: CompleteAssessmentsService,
    private readonly sessionService: SessionsService,
    private readonly mentivityLearnerNavigation: MentivityLearnerNavigation,

  ) {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.LearnerNavigation.learnerSubMenu);
        this.route.queryParams.subscribe((param: any) => {
      if (param.id) {
        this.userId = +param.id;
        this.fname = param.name;
      }
    })
    this.setTitle();
   }

   setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.firstName = `${this.fname.split(' ')[0].toLowerCase()}'s`
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  ngOnInit() {
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.getHistoryVersions();
    this.getActionPlanList();
    this.getAssessmentDetailsByType();

  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  buttonClick(event) {
    this.onClickTab(event.target);
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }

  onClickTab(event) {
    event.classList.toggle("active");
    if (event.classList.contains('active')) {
      this.count++;
      this.openTabCount(this.count);
    } else {
      this.count--;
      this.openTabCount(this.count);
    }
    const panel = event.nextElementSibling;
    if (panel && panel.style && panel.style.maxHeight) {
      this.questionPanelFlag = true;
      panel.style.maxHeight = null;
    } else {
      this.questionPanelFlag = false;
    }
  }

  openTabCount(cntVal) {
    if (cntVal > 0) {
      this.closeAllButton = true;
    } else {
      this.closeAllButton = false;
    }
  }

  spanClick(event) {
    this.onClickTab(event.target.parentNode);
    event.stopPropagation();
  }

  closeAll() {
    const activeAccTabs = document.querySelectorAll('button.accordion.active');
    activeAccTabs.forEach(el => {
      (<HTMLElement>el.nextElementSibling).style.maxHeight = null;
      el.classList.remove('active');
    });
    this.userPlans.forEach(sectionName=>{
      sectionName.isOpen = false;
      });
      this.count = null;
    this.closeAllButton = false;
  }

  getHistoryVersions() {
    this.planInductionService.getHistoryVersions(this.userId).subscribe(result => {
          result.forEach(element => {
            element.planCreatedByfirstName = element.planCreatedByName.split(' ')[0];
            });
            this.planVersionList = result;
    });
  }

  getActionPlanList(){
    this.planInductionService.getUserActionPlan(this.userId).subscribe(data => {
      this.userPlans=data;
      for(let i=0;i<this.userPlans.length;i++){
        this.activeGoals = this.userPlans[i].activeGoalsList;
        }
        this.userPlans.forEach(activeGoals=>{
          activeGoals.activeGoalsList.forEach(action=>{
            action.actionList.forEach(element => {
              if (element.byWhoId !== this.userId){
                element.byWho = element.byWho.split(' ')[0]
              }
            });
          })
         })
     });  
  }

  checkHistory(question) {
    const secName = question.sectionName;
    question.isOpen = !question.isOpen;
    if(question.isOpen){
      for(let i=0;i<question.historyGoalsList.length;i++){
        this.result=question.historyGoalsList
       this.handleResult(this.result, secName);
       }
    }
  }

  handleResult(result, secName) {
    this.historyList = result;
    const sectionName = this.userPlans.filter(sectionNames => sectionNames.sectionName === secName)
    if (this.historyList?.length > 0) {
      sectionName.showHistoryButton = true;
    } else {
      sectionName.showHistoryButton = false;
    }
  }

  showHistory(question) {
    this.historyQuesModal.open(this.userId, question.sectionName, question.questionList[1].questionId);
  }

    goToSection() {
      sessionStorage.setItem('routeState', 'changeAnswer');
      this.router.navigate([this.profileUrl+'/profile/action-plan'],  { queryParamsHandling :"merge"});
      window.scroll(0, 0);
    }
  
  checkActionPlanStatus() {
    const planTypeIdentifier = "2";
    this.planInductionService.checkCarePlanStatus(this.userId, planTypeIdentifier).subscribe(result => {
      this.actionPlanCreatedFlag = result.isMainPlanAgree;
    })
  }

  onClickUpdatePlan() {
    this.questionErrors = [];
    this.updatePlan();
  }

  updatePlan() {
    this.planInductionService.getPlanChanged(this.userId).subscribe(changed => {
      if (changed) {
        const payload = this.formatPayloadForCreatePlan(false);
        this.sendCreatePlan(payload);
        this.changedAns = true;
      }
      else {
          this.confirmService.confirm({
          header: 'Confirm',
          message: 'Are you sure you want to update Action Plan without any changes?',
          acceptLabel: 'Yes',
          rejectLabel: 'No',
          accept: () => {
            const payload = this.formatPayloadForCreatePlan(true);
            this.sendCreatePlan(payload);
          }
        });
      }
     })
  }
  
  formatPayloadForCreatePlan(allowUnchanged: boolean) {
    const payload = {
      "isPlanAgree": false,
      "planTypeIdentifier": "2",
      "serviceUserId": this.userId,
      "allowUnchanged": allowUnchanged
    }
    return payload;
  }

  private sendCreatePlan(payload: any) {
    this.questionErrors = [];
    this.planInductionService.createPlan(payload).subscribe(result => {
      this.snackBarService.success(result.message.successMessage);
      this.router.navigate(['../check-answer'], { queryParams: { id: this.userId, name: this.fname } });
      window.scroll(0, 0);
      this.getHistoryVersions();
    }, error => {
      const colonIndex = error.error.applicationMessage.indexOf(':');
      const formattedString = error.error.applicationMessage.slice(colonIndex + 1, error.error.applicationMessage.length);
      const errorQuestionsArr = formattedString.split(',');

      errorQuestionsArr.forEach(element => {
        const pageDataArr = this.checkAnswersData.filter(section => section.sectionIdentifier === element);
        this.questionErrors.push(
          {
            label: pageDataArr[0].label,
            sectionIdentifier: pageDataArr[0].sectionIdentifier,
          }
        );
      });

      setTimeout(() => {
        const checkAnswersErrorSummary = this.renderer.selectRootElement('.check-answers-error-summary', true);
        checkAnswersErrorSummary.focus();
      });
    });
  }

  showAnswer() {
    this.dialog.open(ViewAssessmentPopUpComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        assessmentQuestionData: this.assessmentQuestionData,
        firstName: this.firstName,
        answerData: this.answerData
      }
    })
  }

  getAssessmentDetailsByType() {
    this.completeAssessmentsService.getAssessmentDetailsByType('SU_Action_Plan_Assessment').subscribe(
      questionData => {
        this.assessmentQuestionData = questionData;
        this.completeAssessmentsService.getAssessmentResultByTemplateId(this.userId, questionData.assessmentTemplateId).subscribe(
          answerData => {
            this.answerData = answerData
          },
          err => console.error(err),
        );
      })
  }

  Authorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

  navigateFurtherInfo(){
    this.router.navigate([this.profileUrl+'/profile/view-further-info'],  { queryParamsHandling :"merge"});
  }

  navigateProfile()
{
  this.router.navigate([this.profileUrl+'/profile'],  { queryParamsHandling :"merge"});
  } 

  navigateToActionPlan(){
    this.router.navigate([this.profileUrl+'/profile/action-plan'],  { queryParamsHandling :"merge"});
  }
  

}
