import { Component, OnDestroy, OnInit } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { LearnerNavigation } from '../learner-nav';
import { TrackTabService } from './track-tab/track-tab.service';

@Component({
  selector: 'vc-plan-content-card',
  templateUrl: './plan-content-card.component.html',
  styleUrls: ['./plan-content-card.component.scss'],
})
export class PlanContentCardComponent implements OnInit, OnDestroy {

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
  tabName='My to do';
  sutodoTabName='Participant to do';
  showTab:boolean=true;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly learnersService: LearnersService,
    private readonly trackTabService: TrackTabService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
  if(this.profileUrl=='person-supported')
  {
    this.tabName='Goals and actions'
  }
  if(this.profileUrl =='clink-learners'){
    this.showTab=false;
  }
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
  
    const featureDetail: any = Utility.getPageTitleByClientIdAndFeatureId("My_To_Do");
    if(featureDetail!=null && featureDetail.sutodoTabName!=null){
      this.sutodoTabName=featureDetail.sutodoTabName;
    }
  }

  async ngOnInit() {
    this.activeTab = 'plan'
    this.activePlanSubTab = 'myGoals';
    this.todaysDate = new Date();
     await this.getActivityRefData();
    this.setStructuralData();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  setTimelineUnixTimestamps() {
    this.timelineStartUnix = this.setTimelineStartUnix();
    this.timelineEndUnix = this.setTimelineEndUnix();
  }

  setTimelineStartUnix() {
    if (this.todaysDate.getMonth() === 0) {
      const previousMonthsNum = 12;
      const previousMonthsYear = this.todaysDate.getFullYear() - 1;
      return new Date(`${previousMonthsYear}/${previousMonthsNum}/01 ${this.timeTimeZoneConstant}`).getTime() / 1000
    } else {
      const previousMonthsNum = this.todaysDate.getMonth();
      const previousMonthsYear = this.todaysDate.getFullYear();
      return new Date(`${previousMonthsYear}/${previousMonthsNum}/01 ${this.timeTimeZoneConstant}`).getTime() / 1000
    }
  }

  setTimelineEndUnix() {
    if (this.todaysDate.getMonth() === 11) {
      const nextMonthsNum = 1;
      const nextMonthsYear = this.todaysDate.getFullYear() - 1;
      const nextMonthTotalDays = new Date(nextMonthsYear, nextMonthsNum, 0).getDate();
      return new Date(`${nextMonthsYear}/${nextMonthsNum}/${nextMonthTotalDays} ${this.timeTimeZoneConstant}`).getTime() / 1000
    } else {
      const nextMonthsNum = this.todaysDate.getMonth() + 2;
      const nextMonthsYear = this.todaysDate.getFullYear();
      const nextMonthTotalDays = new Date(nextMonthsYear, nextMonthsNum, 0).getDate();
      return new Date(`${nextMonthsYear}/${nextMonthsNum}/${nextMonthTotalDays} ${this.timeTimeZoneConstant}`).getTime() / 1000
    }
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

  getGoals() {
    this.learnersService.getGoals(this.userId).subscribe(data => {
      this.goalsData = [];
      if (data.planGoal !== null) {
        const formattedGoals = this.formatInsetGoalsWithCommas(data.planGoal);
        formattedGoals.forEach(goal => {
          this.goalsData.push(
            goal.charAt(0).toUpperCase() + goal.slice(1)
          )
        });
      } else {
        this.goalsData = null;
      }
    }, error => {
      this.noPlanMessage = error.error.applicationMessage
      this.goalsData = null;
    })
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

  setActivePlanSubTab(activePlanSubTabLabel) {
    if (this.activePlanSubTab === 'track') {
      this.getTimelineData();
      this.activePlanSubTab = activePlanSubTabLabel;
    } else {
      this.activePlanSubTab = activePlanSubTabLabel;
    }
  }

  getTimelineData() {
    this.learnersService.getSchedulerData(this.userId).subscribe(data => {
      this.dataList=data.dataList
      this.pathwayList = data.pathwayList.map(element => ({...element, cssLabel: element.name.replace(/\s+/g, '-').toLowerCase()}));
      this.pathwayList.forEach(element => {
        element.cssLabel = element.cssLabel.replace("\/", "and")
        element.cssLabel = element.cssLabel.replace("&", "and")
        element.cssLabel = element.cssLabel.replace(/[, ]+/g, "")
      });

      const tempDataList: any[] = data.dataList;
      tempDataList.forEach(element => {
        element.startDate = element.startDate.replace(/-/g, "\/");
        element.endDate = element.endDate.replace(/-/g, "\/");
        element.unixStartDate = new Date(`${element.startDate} ${this.timeTimeZoneConstant}`).getTime() / 1000;
        element.unixEndDate = new Date(`${element.endDate} ${this.timeTimeZoneConstant}`).getTime() / 1000;
      });
      const sortedTempTimelineData = tempDataList.sort((a, b) => a.unixEndDate - b.unixEndDate);
      this.pathwayList.forEach(element => {
        element.timelineEntriesData = []
        const tempData: any[] = tempDataList.filter(data => data.pathwayId === element.id)
        tempData.forEach(data => {
          element.timelineEntriesData.push([]);
        })
        element.tempTimelineEntriesData = [];
      });

      const orderedSortedTempTimelineData = this.orderSortedTimelineData(sortedTempTimelineData)
      this.formatEntriesData(orderedSortedTempTimelineData);
      this.removeTimelinesEmptyArrays();
      this.filterPathwayList(data.dataList);
    })
  }

  removeTimelinesEmptyArrays() {
    this.pathwayList.forEach(element => {
      element.timelineEntriesData = element.timelineEntriesData.filter(element => element.length > 0)
    });
  }

  filterPathwayList(dataList: any) {
    const dataPathwayIds: number[] = dataList.map(element => element.pathwayId);
    this.pathwayList = this.pathwayList
      .filter(element => dataPathwayIds.includes(element.id));
  }


  orderSortedTimelineData(sortedTimelineData) {
    sortedTimelineData.forEach(element => {
      this.pathwayList[element.pathwayId - this.pathwayList[0].id].tempTimelineEntriesData.push(element)
    })

    for (let i = 0; i < this.pathwayList.length; i++) {
      if (this.pathwayList[i].tempTimelineEntriesData.length > 5) {
        const wholeTimelineEntries = this.pathwayList[i].tempTimelineEntriesData.filter(entry =>
          entry.unixStartDate < this.timelineStartUnix && entry.unixEndDate > this.timelineEndUnix
        )
        const nonWholeTimelineEntries = this.pathwayList[i].tempTimelineEntriesData.filter(entry => 
          ((entry.unixStartDate < this.timelineStartUnix || entry.unixStartDate >= this.timelineStartUnix) && entry.unixEndDate <= this.timelineEndUnix) ||
          (entry.unixStartDate >= this.timelineStartUnix && (entry.unixEndDate <= this.timelineEndUnix || entry.unixEndDate > this.timelineEndUnix))
        )
        const entriesListWithWholeTimeslinesFirst = wholeTimelineEntries.concat(nonWholeTimelineEntries)
        const firstFiveEntriesToFinish = entriesListWithWholeTimeslinesFirst.slice(0, 5)
        const remainingEntries = entriesListWithWholeTimeslinesFirst.slice(5)
        const sortedRemainingEntries = remainingEntries.sort((a, b) => a.unixStartDate - b.unixStartDate);
        const tempOrderedEntries = firstFiveEntriesToFinish.concat(sortedRemainingEntries);
        this.pathwayList[i].orderedTempTimelineEntriesData = tempOrderedEntries
      } else {
        this.pathwayList[i].orderedTempTimelineEntriesData = this.pathwayList[i].tempTimelineEntriesData
      }
    }

    return this.pathwayList[0].orderedTempTimelineEntriesData.concat(
      this.pathwayList[1]?.orderedTempTimelineEntriesData, 
      this.pathwayList[2]?.orderedTempTimelineEntriesData, 
      this.pathwayList[3]?.orderedTempTimelineEntriesData, 
      this.pathwayList[4]?.orderedTempTimelineEntriesData,
      this.pathwayList[5]?.orderedTempTimelineEntriesData, 
      this.pathwayList[6]?.orderedTempTimelineEntriesData, 
      this.pathwayList[7]?.orderedTempTimelineEntriesData, 
      this.pathwayList[8]?.orderedTempTimelineEntriesData,
      this.pathwayList[9]?.orderedTempTimelineEntriesData, 
      this.pathwayList[10]?.orderedTempTimelineEntriesData, 
      this.pathwayList[11]?.orderedTempTimelineEntriesData, 
      this.pathwayList[12]?.orderedTempTimelineEntriesData,
      this.pathwayList[13]?.orderedTempTimelineEntriesData
    )
  }

  formatEntriesData(entriesData) {
    entriesData.forEach(element => {
      const arrIndex = this.pathwayList.findIndex(entryObject => entryObject.id === element.pathwayId);
      element.cssLabel = this.pathwayList[arrIndex].cssLabel;
      this.formatCategoryRows(element, arrIndex);
    });
  }

  formatCategoryRows(element, arrIndex) {
    for (let i = 0; i < this.pathwayList[arrIndex].timelineEntriesData.length; i++) {
      if (
        this.pathwayList[arrIndex].timelineEntriesData[i].length === 0 ||
        this.pathwayList[arrIndex].timelineEntriesData[0].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[1].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[2].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[3].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[4].length > 0 &&
        this.pathwayList[arrIndex].timelineEntriesData[5].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[6].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[7].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[8].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[9].length > 0 &&
        this.pathwayList[arrIndex].timelineEntriesData[10].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[11].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[12].length > 0 && 
        this.pathwayList[arrIndex].timelineEntriesData[13].length > 0 && 
        element.unixStartDate >= this.pathwayList[arrIndex].timelineEntriesData[i][this.pathwayList[arrIndex].timelineEntriesData[i].length-1].unixEndDate &&
        (
          element.unixStartDate !== this.pathwayList[arrIndex].timelineEntriesData[i][this.pathwayList[arrIndex].timelineEntriesData[i].length-1].unixStartDate && 
          element.unixEndDate !== this.pathwayList[arrIndex].timelineEntriesData[i][this.pathwayList[arrIndex].timelineEntriesData[i].length-1].unixEndDate
        )
      ) {
        this.pathwayList[arrIndex].timelineEntriesData[i].push(element)
        break;
      }
    }
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
    this.setTimelineUnixTimestamps();
    this.getGoals();
    this.getTimelineData();
    this.getAndFormatHistoryTabData();
  }

}
