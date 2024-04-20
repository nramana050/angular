import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanInductionService } from '../plan-induction.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-action-plan-history',
  templateUrl: './action-plan-history.component.html',
  styleUrls: ['./action-plan-history.component.scss']
})
export class ActionPlanHistoryComponent implements OnInit {
  userId: number;
  userPlans: any=[];
  suId: any;
  sectionName: any;
  historySectionName: string;
  _visible: boolean;
  historyList: any;
  filterList: any;
  actionList: any;
  questionId: any;

  today: Date;
  Nextday: any;
  todayDay: any ;
  dateFormat = 'yyyy-MM-dd';
  actionFilterData: any;
  actionDate = [];
  numberOfDaysToAdd: number

  constructor(
    private readonly planInductionService: PlanInductionService,
    private readonly route: ActivatedRoute,
    private readonly renderer: Renderer2,
    private readonly datepipe: DatePipe
  ) { 
    this.route.queryParams.subscribe((param: any) => {
      if (param.id) {
        this.userId = +param.id;
      }
    })
   } 

  ngOnInit(): void {
    this.getActionPlanList(this.questionId);
  }

  getActionPlanList(questionId){
    this.planInductionService.getUserActionPlan(this.userId).subscribe(data => {
      this.today=new Date();
      this.Nextday = new Date();
      this.numberOfDaysToAdd = 7;

      this.Nextday.setDate(this.Nextday.getDate() + this.numberOfDaysToAdd);
      this.todayDay = this.datepipe.transform(this.today,this.dateFormat);
      this.Nextday = this.datepipe.transform(this.Nextday,this.dateFormat);
      this.userPlans=data;
      this.userPlans.forEach(element => {
        element.historyGoalsList.forEach(goal => {
             goal.actionList.forEach(action => {
              if(action.byWhoId!==this.userId){
                action.byWho=action.byWho.split(' ')[0];
              }
             });
        });
      });
      for(let i=0; i< this.userPlans.length;i++){
        this.historyList=this.userPlans[i]?.historyGoalsList;
        if(this.historyList[0]?.questionId===questionId){
        this.filterList=this.historyList.filter(list=>list.questionId===questionId)
          for (let j = 0; j < this.filterList.length; j++) {
            this.actionFilterData = this.filterList[j].actionList;
            for (let k = 0; k < this.actionFilterData.length; k++) {
              this.actionDate.push(this.actionFilterData[k].byWhen)
            }
          }
      }
      }
     });    
  }


  open(suId: any, sectionName: any, questionId:any) {
    this.suId = suId;
    this.historySectionName = sectionName;
    this.questionId=questionId;
    
    this.getActionPlanList(questionId);
    this.visible = true;
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
      lastElement .onkeydown = function (e) {
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
  

}
