import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { TrackTabService } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-system-interaction-v2',
  templateUrl: './system-interaction-v2.component.html',
  styleUrls: ['./system-interaction-v2.component.scss']
})
export class SystemInteractionV2Component implements OnInit {
  activeTab: string;
  activePlanSubTab: string;
  fname: string;
  goalsData: any = undefined;
  historyData: any = undefined;
  userId: string;
  noPlanMessage: string;
  pathwayList: any = undefined;
  todaysDate: Date;
  timelineStartUnix: number;
  timelineEndUnix: number;
  fStructureData: any = undefined;
  timeTimeZoneConstant = '14:00:00 GMT+00:00';
  loadMoreVisible = false;
  fStructureDataPageNumber: number = undefined;
  activityIds=[];
  dataList:number;
  profileUrl;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly learnersService: LearnersService,
    private readonly trackTabService: TrackTabService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
  }

  async ngOnInit() {
    
    this.activeTab = 'plan'
    this.activePlanSubTab = 'track';
    // this.getTimelineData();
    this.todaysDate = new Date();
     await this.getActivityRefData();
    this.setStructuralData();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
      }
      if (params.id) {
        this.userId = params.id;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  getAndFormatHistoryTabData() {
    this.fStructureDataPageNumber = 0;
    this.learnersService.getFstructureData(this.userId, this.fStructureDataPageNumber).subscribe(data => {
      this.fStructureData = data.content.map(entry => (
        {
          ...entry, 
          entryDateUnix: this.formatEntryDateUnix(entry),
          formattedDescription: this.formatDescription(entry),
        }
      ))
      if (!data.empty) {
        this.addTodayLineEntryToFStructureData();
      }
      data.last ? this.loadMoreVisible = false : this.loadMoreVisible = true;
    })
  }

  formatDescription(entry) {
    if (entry.activityId === -1 || entry.title === "System Interaction") {
      const descriptionArr = [];
      descriptionArr.push(entry.description.slice(1, entry.description.length - 1))
      if (entry.title === 'Employment pathway changed') {
        const tempFormattedDescriptionArr = this.formatGoals(descriptionArr);
        return tempFormattedDescriptionArr.map(answerString => {
          const tempAnswerArr = answerString.split("~~")
          return tempAnswerArr.map(answer => {
            return answer.trim();
          })
        })
      } else {
        return this.formatGoals(descriptionArr)
      }
    } else {
      return null
    }
  }

  formatEntryDateUnix(entry) {
    let entryDateString = '';
    switch(entry.activityId) {
      case this.activityIds[1]:
        const hyphenIndex = entry.subTitle.indexOf('-')
        if (entry.interventionType === 'End') {
          entryDateString = entry.subTitle.substring(hyphenIndex + 1);
          return new Date(`${entryDateString} ${this.timeTimeZoneConstant}`).getTime() / 1000;
        } else {
          entryDateString = entry.subTitle.substring(0, hyphenIndex - 1);
          return new Date(`${entryDateString} ${this.timeTimeZoneConstant}`).getTime() / 1000;
        }
      case this.activityIds[2]:
        const atIndex = entry.subTitle.search('Start')
        entryDateString = entry.subTitle.substring(0, atIndex - 1);
        return new Date(`${entryDateString} ${this.timeTimeZoneConstant}`).getTime() / 1000;
      case this.activityIds[3]:
        const byIndex = entry.subTitle.search('by')
        entryDateString = entry.subTitle.substring(0, byIndex - 1);
        return new Date(`${entryDateString} ${this.timeTimeZoneConstant}`).getTime() / 1000;
      default:
        return new Date(`${entry.subTitle} ${this.timeTimeZoneConstant}`).getTime() / 1000;
    }
  }

  addTodayLineEntryToFStructureData() {
    const todaysDateDay = this.todaysDate.getDate()
    const todaysDateMonth = this.todaysDate.getMonth()
    const todaysDateYear = this.todaysDate.getFullYear()
    const todaysDateString = `${todaysDateMonth + 1}/${todaysDateDay}/${todaysDateYear}`;
    const todayDateUnix = new Date(`${todaysDateString} ${this.timeTimeZoneConstant}`).getTime() / 1000;
    const firstHistoryEntryIndex = this.fStructureData.findIndex(entry => entry.entryDateUnix <= todayDateUnix)
    const todayLineEntry = {
      activityId: 'today',
      entryDateUnix: todayDateUnix,
      title: "Today",
    }
    if (firstHistoryEntryIndex === -1) {
      for (let i = 0; i < this.fStructureData.length; i++) {
        this.fStructureData[i].isFuture = true;
      }
      this.fStructureData.push(todayLineEntry)
    } else {
      this.fStructureData.splice(firstHistoryEntryIndex, 0, todayLineEntry);
      for (let i = 0; i < firstHistoryEntryIndex; i++) {
        this.fStructureData[i].isFuture = true;
      }
    }
  }

  formatInsetGoalsWithCommas(goalsArr) {
    const tempGoalsArr = [];
    goalsArr.forEach(element => {
      const colonIndex = element.indexOf(':');
      const formattedString = element.slice(0, colonIndex - 1) + ',' + element.slice(colonIndex + 2, element.length);
      tempGoalsArr.push(formattedString)
    });

    if (tempGoalsArr.length > 0) {
      const tempCommaSplitIndex = [];
      const tempCommaNotSplitIndex = [];
  
      for (let i = 0; i < tempGoalsArr[0].length; i++) {
        if (tempGoalsArr[0][i] === ',') {
          tempGoalsArr[0][i+1] === ' ' ? tempCommaNotSplitIndex.push([i]) : tempCommaSplitIndex.push([i]);
        }
      }
      const formattedGoalsArray = this.setTempFormattedGoalsArr(tempCommaSplitIndex, tempGoalsArr)
      formattedGoalsArray.shift();
      return formattedGoalsArray
    } else {
      return goalsArr
    }
  }

  formatGoals(goalsArr) {
    const splitAnswerArr = this.formatGoalWithCommas(goalsArr);
    const formattedTempGoalsArr = [];
    splitAnswerArr.forEach(element => {
      formattedTempGoalsArr.push(element.charAt(0).toUpperCase() + element.slice(1));
    })
    return formattedTempGoalsArr
  }

  formatGoalWithCommas(goalsArr) {
    const tempCommaSplitIndex = [];
    const tempCommaNotSplitIndex = [];

    let i = 0;
    for (i = 0; i < goalsArr[0].length; i++) {
      if (goalsArr[0][i] === ',') {
        goalsArr[0][i+1] === ' ' ? tempCommaNotSplitIndex.push([i]) : tempCommaSplitIndex.push([i]);
      }
    }
    return this.setTempFormattedGoalsArr(tempCommaSplitIndex, goalsArr)
  }

  setTempFormattedGoalsArr(tempCommaSplitIndex, goalsArr) {
    const tempFormattedAnswerArr = [];
    switch(tempCommaSplitIndex.length) {
      case 0:
        tempFormattedAnswerArr.push(goalsArr[0]);
        break;
      case 1:
        tempFormattedAnswerArr.push(goalsArr[0].substring(0, tempCommaSplitIndex[0]))
        tempFormattedAnswerArr.push(goalsArr[0].substring(parseInt(tempCommaSplitIndex[0])+1, goalsArr[0].length))
        break;
      default:
        let i = 0;
        for (i = 0; i < tempCommaSplitIndex.length; i++) {
          if (i === 0) {
            tempFormattedAnswerArr.push(goalsArr[0].substring(0, tempCommaSplitIndex[i]))
          } else if (i === tempCommaSplitIndex.length - 1) {
            tempFormattedAnswerArr.push(goalsArr[0].substring(parseInt(tempCommaSplitIndex[i-1])+1, parseInt(tempCommaSplitIndex[i])))
            tempFormattedAnswerArr.push(goalsArr[0].substring(parseInt(tempCommaSplitIndex[i])+1, goalsArr[0].length))
          } else {
            tempFormattedAnswerArr.push(goalsArr[0].substring(parseInt(tempCommaSplitIndex[i-1])+1, parseInt(tempCommaSplitIndex[i])))
          }
        }
    }
    return tempFormattedAnswerArr
  }

  onLoadMoreClicked($event: any) {
    this.fStructureDataPageNumber = this.fStructureDataPageNumber + 1
    this.learnersService.getFstructureData(this.userId, this.fStructureDataPageNumber).subscribe(data => {
      const formattedData = data.content.map(entry => (
        {
          ...entry, 
          entryDateUnix: this.formatEntryDateUnix(entry),
          formattedDescription: this.formatDescription(entry),
        }
      ))
      this.fStructureData = this.fStructureData.concat(formattedData)
      data.last ? this.loadMoreVisible = false : this.loadMoreVisible = true;
    })
  }

  onNewEntryAdded($event: any) {
    this.getAndFormatHistoryTabData();
  }

  updateFStructureDataAfterEntryChange(event) {
    this.getAndFormatHistoryTabData();
  }

  getActivityRefData() {
    return new Promise(resolve => {
      this.trackTabService.getActivityRefData().subscribe(data => {
        this.activityIds = data.activityList.map(data => data.id)
        resolve(this.activityIds);
      })
    })
  }

  setStructuralData() {
    this.getAndFormatHistoryTabData();
  }
}
