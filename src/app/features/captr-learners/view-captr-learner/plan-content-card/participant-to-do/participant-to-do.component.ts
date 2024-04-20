import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { PlanInductionService } from '../../plan-induction/plan-induction.service';
import { MyColorsData } from '../my-goals-tab/title-color-data';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-participant-to-do',
  templateUrl: './participant-to-do.component.html',
  styleUrls: ['./participant-to-do.component.scss']
})
export class ParticipantToDoComponent implements OnInit {

  userId: any;
  isSelfAssign: boolean = true;
  serviceUserData: boolean = true;
  myColors = MyColorsData.myColors;
  activeTab: string;
  serviceUserId: any;
  questionId: any;
  today: Date;
  dateFormat = 'yyyy-MM-dd';
  allGoalList: any[];
  getUniqueId = [];
  actionList = [];
  actionAllList = [];
  refActionChoiceList = [];
  serId: any;
  getUniqueIdSuList = [];
  overdueActionList = [];
  comingdueActionList = [];
  onTrackList = [];
  getOverdueIdList = [];
  getOverdueId = [];
  getComingdueIdList = [];
  getComingdueId = [];
  getOnTrackIdList = [];
  getOnTrackId = [];
  completeActionList = [];
  getSUUniqueId = [];
  getCompleteId = [];
  getCompleteIdList = [];
  actionListNew = [];
  showCompltedGoals: boolean=false;
  newActionList=[];
  questionData:any[];
  profileUrl;

  constructor(
    public captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly datepipe: DatePipe,
    private readonly planInductionService: PlanInductionService )
    {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.route.queryParams.subscribe((params: any) => {
      this.route.snapshot.data['title'] = params.fullName;
      this.userId = +params.id;
      this.serviceUserId = params.id;
    }); 
  }

  ngOnInit(): void {
    this.activeTab = 'total';
    this.getKWAssignList();
    this.getRefActionChoices()
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

  getKWAssignList() {
    // this.serviceUserData = !this.serviceUserData
    this.today = new Date();
    this.isSelfAssign = false;
    this.captrLearnersService.getSUAssignList(this.isSelfAssign, this.serviceUserId).subscribe((data) => {
      this.allGoalList = data;
      
      for (let i = 0; i < this.allGoalList.length; i++) {
        this.actionList = this.allGoalList[i].actionList;
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
      for (let j = 0; j < this.allGoalList?.length; j++) {
        this.getUniqueIdSuList.push(this.allGoalList[j].questionId)
      }
      this.getSUUniqueId = this.getUniqueIdSuList.filter((item, i, ar) => ar.indexOf(item) === i);
    });
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
}
