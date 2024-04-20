import { Component, Input, OnInit } from '@angular/core';
import { MyColorsData } from './title-color-data';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { PlanInductionService } from '../../plan-induction/plan-induction.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-my-goals-tab',
  templateUrl: './my-goals-tab.component.html',
  styleUrls: ['./my-goals-tab.component.scss']
})
export class MyGoalsTabComponent implements OnInit {

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
  @Input() dashboard:boolean;

  constructor(
    public readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly datepipe: DatePipe,
    private readonly planInductionService: PlanInductionService,
    private readonly router: Router) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    console.log(this.profileUrl,"client url");
    
    this.route.queryParams.subscribe((params: any) => {
      this.route.snapshot.data['title'] = params.fullName;
      this.serviceUserId = params.id;
    });
  }

  ngOnInit(): void {
    if (this.dashboard) {
      this.getKWAssignList();
    } else {
      this.getSUAssignList();
    }
    this.activeTab = 'total';
    this.resolveCurrentPageData(57);
    this.getRefActionChoices();
  }

  resolveCurrentPageData(questionNumber) {
    if(this.dashboard) {
      this.planInductionService.getQuestionForDashboard(questionNumber).subscribe(data => {
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
    else {
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
   
  }

  getSUAssignList() {
    this.today = new Date();
    this.isSelfAssign = true;
    this.captrLearnersService.getSUAssignList(this.isSelfAssign, this.serviceUserId).subscribe((res) => {
      this.patchResponce(res)
    })
  }

  getKWAssignList() {
    this.today = new Date();
    this.isSelfAssign = true;
    this.captrLearnersService.getKWAssignList().subscribe((res) => {
      this.patchResponce(res)
    })
  }

  patchResponce(resp) {
    this.suActionList = resp;
    for (let i = 0; i < this.suActionList.length; i++) {
      this.actionList = this.suActionList[i].actionList;
      for (let j = 0; j < this.actionList.length; j++) {
        this.actionListNew.push(this.actionList[j]);
        this.checkStatus(j);
      }
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
}
