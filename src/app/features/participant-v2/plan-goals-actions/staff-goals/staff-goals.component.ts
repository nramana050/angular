import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { MyColorsData } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/my-goals-tab/title-color-data';
import { PlanInductionService } from 'src/app/features/captr-learners/view-captr-learner/plan-induction/plan-induction.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { ParticipantV2Service } from '../../participant-v2.service';

@Component({
  selector: 'app-staff-goals',
  templateUrl: './staff-goals.component.html',
  styleUrls: ['./staff-goals.component.scss']
})
export class StaffGoalsComponent implements OnInit ,OnDestroy{

  userId: any;
  isSelfAssign: boolean = true;
  serviceUserData: boolean = true;
  myColors = MyColorsData.myColors;
  getUniqueIdSuList = [];
  activeTab: string;
  serviceUserId: any;
  questionId: any;
  suActionList = [];
  overdueActionList = [];
  comingdueActionList = [];
  onTrackList = [];
  getOverdueIdList = [];
  getOverdueId = [];
  getComingdueIdList = [];
  getComingdueId = [];
  getOnTrackIdList = [];
  getOnTrackId = [];
  today: Date;
  dateFormat = 'yyyy-MM-dd';
  completeActionList = [];
  getSUUniqueId = [];
  getCompleteId = [];
  getCompleteIdList = [];
  actionList = [];
  actionListNew = [];
  showCompltedGoals: boolean=false;
  newActionList=[];
  questionData:any[];
  currentPageData:any[]=[];
  refActionChoiceList:any[];
  profileUrl;
  fname: string;

  constructor(
    public readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly datepipe: DatePipe,
    private readonly planInductionService: PlanInductionService,
    private readonly router: Router,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly participantV2Service: ParticipantV2Service) {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
       this.setTitle();
    this.route.queryParams.subscribe((params: any) => {
      // this.route.snapshot.data['title'] = params.fullName;
      this.serviceUserId = params.id;
    });
  }

  ngOnInit(): void {
    this.getSUAssignList();
    this.activeTab = 'total';
    // this.resolveCurrentPageData(57);
    // this.getRefActionChoices();
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.fname = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.fname}`;
    });
  }

  resolveCurrentPageData(questionNumber) {
    this.planInductionService.getQuestion(questionNumber, this.serviceUserId).subscribe(data => {
      this.questionData = data;
      let index = 0;
      data.forEach(group => {
        group.questionList.forEach((question) => {
          if (question.componentType === 'rating') {
            MyColorsData.myColors[index]['questionId'] = question.id;
            MyColorsData.myColors[index]['title'] = question.groupDescription.toUpperCase() + " " + "GOALS"
            MyColorsData.myColors[index]['componentType'] = question.componentType;
            index++;
          }
        })
      })
    })
  }

  getSUAssignList() {
    this.today = new Date();
    this.isSelfAssign = true;
    this.participantV2Service.getSUAssignList(this.isSelfAssign, this.serviceUserId).subscribe((res) => {
      // this.suActionList = res;
      this.actionList = res;
      for (let j = 0; j < this.actionList.length; j++) {
        this.actionListNew.push(this.actionList[j]);
        this.checkStatus(j);
      }
      for (let i = 0; i < this.completeActionList?.length; i++) {
        this.getCompleteIdList.push(this.completeActionList[i].id)
      }
      this.getCompleteId = this.getCompleteIdList.filter((item, i, ar) => ar.indexOf(item) === i);
      for (let i = 0; i < this.overdueActionList?.length; i++) {
        this.getOverdueIdList.push(this.overdueActionList[i].id)
      }
      this.getOverdueId = this.getOverdueIdList.filter((item, i, ar) => ar.indexOf(item) === i);
      for (let i = 0; i < this.comingdueActionList?.length; i++) {
        this.getComingdueIdList.push(this.comingdueActionList[i].id)
      }
      this.getComingdueId = this.getComingdueIdList.filter((item, i, ar) => ar.indexOf(item) === i);
      for (let i = 0; i < this.onTrackList?.length; i++) {
        this.getOnTrackIdList.push(this.onTrackList[i].id)
      }
      this.getOnTrackId = this.getOnTrackIdList.filter((item, i, ar) => ar.indexOf(item) === i);
      for (let j = 0; j < this.suActionList?.length; j++) {
        this.getUniqueIdSuList.push(this.suActionList[j].questionId)
      }
      this.getSUUniqueId = this.getUniqueIdSuList.filter((item, i, ar) => ar.indexOf(item) === i);
    })
  }

  checkStatus (j : number){
    if (this.actionList[j]?.status !== "Completed") {
      this.newActionList.push(this.actionList[j]);
    }
    if (this.actionList[j]?.status === "Completed") {
      this.completeActionList.push(this.actionList[j]);
    }
    else if (this.actionList[j]?.byWhen < this.datepipe.transform(this.today, this.dateFormat)) {
      this.overdueActionList.push(this.actionList[j]);
    }
    else if ((this.datepipe.transform(this.today, this.dateFormat) <= this.actionList[j]?.byWhen
        && this.actionList[j]?.byWhen <= this.datepipe.transform(new Date(new Date().setDate(new Date().getDate() + 7)), this.dateFormat))) {
      this.comingdueActionList.push(this.actionList[j]);
    }
    else if (this.actionList[j]?.byWhen > this.datepipe.transform(new Date(new Date().setDate(new Date().getDate() + 7)), this.dateFormat)) {
      this.onTrackList.push(this.actionList[j]);
    }
  }

  completedGoalsTab(){
    this.showCompltedGoals=!this.showCompltedGoals;
    const completedGoal = document.getElementById("completed")
    if(this.showCompltedGoals){
    completedGoal.style.backgroundColor = '#e8e8e8';
    completedGoal.style.border = 'outset';
  }
  else{
    completedGoal.style.backgroundColor = 'white';
    completedGoal.style.border = 'none';
    completedGoal.style.borderBottom = '3px solid #b1b4b6';
  }
  }

  getRefActionChoices() {
    this.planInductionService.getRefActionChoices().subscribe(data => {
      this.refActionChoiceList = data;
    });
  }

  getJointActionId(id) {
    let action = this.refActionChoiceList.filter(data => data.id == id)[0]
    if (action && action.name === 'Joint action') {
      return action.id
    }
    else {
      return null
    }
  }

  addReminder(itemData: any) {
    const actionPayload = { "actionId": itemData.id }
    this.planInductionService.AddReminderForAction(actionPayload).subscribe((res: any) => {
      if (res.status == 200) {
        this.refreshComponent();
      }
    });
  }

  refreshComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: "merge"
    })
  }
  goTOPersonGoals()
  {
    this.router.navigate([this.profileUrl + '/plan'], { queryParamsHandling: 'merge' });
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null)
  }
}
