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
  selector: 'app-person-supported-goals',
  templateUrl: './person-supported-goals.component.html',
  styleUrls: ['./person-supported-goals.component.scss']
})
export class PersonSupportedGoalsComponent implements OnInit , OnDestroy{

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
  fname: string;

  constructor(
    public captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly datepipe: DatePipe,
    private readonly planInductionService: PlanInductionService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly router: Router,
    private readonly participantV2Service: ParticipantV2Service, )
    {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
       this.setTitle();
    this.route.queryParams.subscribe((params: any) => {
      // this.route.snapshot.data['title'] = params.fullName;
      this.userId = +params.id;
      this.serviceUserId = params.id;
    }); 
  }

  ngOnInit(): void {
    this.activeTab = 'total';
    this.getKWAssignList();
    this.getRefActionChoices()
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.fname = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.fname}`;
    });
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
    this.participantV2Service.getSUAssignList(this.isSelfAssign, this.serviceUserId).subscribe((data) => {
      this.actionList = data;
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

      console.log(this.getOverdueIdList,"getOverdueId");
      
      for (let i = 0; i < this.comingdueActionList?.length; i++) {
        this.getComingdueIdList.push(this.comingdueActionList[i].id)
      }
      this.getComingdueId = this.getComingdueIdList.filter((item, i, ar) => ar.indexOf(item) === i);

      console.log("getComingdueId",this.getComingdueIdList);
      
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
      console.log(this.actionList[j],'kkk');
      
    }
    if (this.actionList[j]?.status === "Completed") {
      this.completeActionList.push(this.actionList[j]);
      console.log(this.actionList[j],'Completed');
    }
    else if (this.actionList[j]?.byWhen < this.datepipe.transform(this.today, this.dateFormat)) {
      this.overdueActionList.push(this.actionList[j]);
      console.log(this.actionList[j],'pppp');
    }
    else if ((this.datepipe.transform(this.today, this.dateFormat) <= this.actionList[j]?.byWhen
        && this.actionList[j]?.byWhen <= this.datepipe.transform(new Date(new Date().setDate(new Date().getDate() + 7)), this.dateFormat))) {
      this.comingdueActionList.push(this.actionList[j]);
      console.log(this.actionList[j],'fffff');
    }
    else if (this.actionList[j]?.byWhen > this.datepipe.transform(new Date(new Date().setDate(new Date().getDate() + 7)), this.dateFormat)) {
      this.onTrackList.push(this.actionList[j]);
      console.log(this.actionList[j],'llll');
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

  goTOPersonGoals()
  {
    this.router.navigate([this.profileUrl + '/plan'], { queryParamsHandling: 'merge' });
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null)
  }
}
