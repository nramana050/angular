import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'src/app/framework/service/main.service';

@Component({
  selector: 'app-schedule-tab',
  templateUrl: './schedule-tab.component.html',
  styleUrls: ['./schedule-tab.component.scss']
})
export class ScheduleTabComponent implements OnInit {

  @HostListener('document:click', ['$event'])
  documentClick(event) {
    const clickedClassList = Array.from(event.target.classList);
    const clickedClassListFiltered = clickedClassList.filter(className => className === 'entry-bar' || className === 'entry-label-content');
    if (clickedClassListFiltered.length === 0) {
      this.infoPanelEntry = null;
    }
  }

  @Input() pathwayList: any[];
  infoPannelColor: any;

  pathwayLabelDivLeftPosition: number;
  monthsNames = new Array<string>();
  monthDivWidth: number;
  monthDividerWidth: number;

  todaysDate: Date;
  leftPixelsTodayLine: number;
  leftPixelBufferConstant: number;

  previousMonthLabel: string;
  previousMonthLabelUnixFormat: string;
  previousMonthNum: number;
  previousMonthYear: number;
  previousMonthTotalDays: number;
  previousMonthDayPixels: number;
  previousMonthStartUnix: number;
  previousMonthEndUnix: number;

  currentMonthLabel: string;
  currentMonthLabelUnixFormat: string;
  currentMonthNum: number;
  currentMonthTotalDays: number;
  currentMonthDayPixels: number;
  currentMonthStartUnix: number;
  currentMonthEndUnix: number;

  nextMonthLabel: string;
  nextMonthLabelUnixFormat: string;
  nextMonthNum: number;
  nextMonthYear: number;
  nextMonthTotalDays: number;
  nextMonthDayPixels: number;
  nextMonthStartUnix: number;
  nextMonthEndUnix: number;

  infoPanelEntry: any;

  @ViewChild('monthDiv') monthDiv: ElementRef;
  @ViewChild('pathwayLabelDiv') pathwayLabelDiv: ElementRef;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly mainService: MainService
  ) {
    this.mainService.pageTitle = 'My Calendar';
    this.mainService.pageMainTitle = 'My Programme';
  }

  ngOnDestroy(): void {
    this.mainService.pageMainTitle = '';
  }

  ngOnInit() {
    this.monthsNames[0] = "January";
    this.monthsNames[1] = "February";
    this.monthsNames[2] = "March";
    this.monthsNames[3] = "April";
    this.monthsNames[4] = "May";
    this.monthsNames[5] = "June";
    this.monthsNames[6] = "July";
    this.monthsNames[7] = "August";
    this.monthsNames[8] = "September";
    this.monthsNames[9] = "October";
    this.monthsNames[10] = "November";
    this.monthsNames[11] = "December";

    this.monthDividerWidth = 5;
    this.leftPixelBufferConstant = 20;
    this.setDefaultMonths();
  }

  ngAfterViewChecked() {
    if (this.pathwayList) {
      this.calcTodayLinePosition();
      this.changeDetectorRef.detectChanges();
    }
  }

  setDefaultMonths() {
    this.todaysDate = new Date();
    this.currentMonthLabel = `${this.monthsNames[this.todaysDate.getMonth()]} ${this.todaysDate.getFullYear()}`
    this.currentMonthLabelUnixFormat = `${this.monthsNames[this.todaysDate.getMonth()]}/${this.todaysDate.getFullYear()}`
    this.currentMonthNum = this.todaysDate.getMonth();
    this.previousMonthLabel = this.setPreviousMonth();
    this.nextMonthLabel = this.setNextMonth();
    this.setMonthsTotalDays();
    this.setMonthsUnixTimestamps();
  }

  setPreviousMonth() {
    if (this.todaysDate.getMonth() === 0) {
      this.previousMonthNum = 11;
      this.previousMonthYear = this.todaysDate.getFullYear() - 1;
      this.previousMonthLabelUnixFormat = `${this.monthsNames[11]}/${this.todaysDate.getFullYear() - 1}`
      return `${this.monthsNames[11]} ${this.todaysDate.getFullYear() - 1}`
    } else {
      this.previousMonthNum = this.todaysDate.getMonth() - 1;
      this.previousMonthYear = this.todaysDate.getFullYear();
      this.previousMonthLabelUnixFormat = `${this.monthsNames[this.todaysDate.getMonth() - 1]}/${this.todaysDate.getFullYear()}`
      return `${this.monthsNames[this.todaysDate.getMonth() - 1]} ${this.todaysDate.getFullYear()}`
    }
  }

  setNextMonth() {
    if (this.todaysDate.getMonth() === 11) {
      this.nextMonthNum = 0;
      this.nextMonthYear = this.todaysDate.getFullYear() + 1;
      this.nextMonthLabelUnixFormat = `${this.monthsNames[0]}/${this.todaysDate.getFullYear() + 1}`;
      return `${this.monthsNames[0]} ${this.todaysDate.getFullYear() + 1}`
    } else {
      this.nextMonthNum = this.todaysDate.getMonth() + 1;
      this.nextMonthYear = this.todaysDate.getFullYear();
      this.nextMonthLabelUnixFormat = `${this.monthsNames[this.todaysDate.getMonth() + 1]}/${this.todaysDate.getFullYear()}`
      return `${this.monthsNames[this.todaysDate.getMonth() + 1]} ${this.todaysDate.getFullYear()}`
    }
  }

  setMonthsTotalDays() {
    this.previousMonthTotalDays = this.getDaysInMonth(this.previousMonthNum + 1, this.todaysDate.getFullYear());
    this.currentMonthTotalDays = this.getDaysInMonth(this.currentMonthNum + 1, this.todaysDate.getFullYear());
    this.nextMonthTotalDays = this.getDaysInMonth(this.nextMonthNum + 1, this.todaysDate.getFullYear());
  }

  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  setMonthsUnixTimestamps() {
    const startDateOfPreviousMonth = `1/${this.previousMonthLabelUnixFormat} 14:00:00 GMT+00:00`;
    this.previousMonthStartUnix = new Date(startDateOfPreviousMonth).getTime() / 1000;
    const endDateOfPreviousMonth = `${this.previousMonthTotalDays}/${this.previousMonthLabelUnixFormat} 14:00:00 GMT+00:00`
    this.previousMonthEndUnix = new Date(endDateOfPreviousMonth).getTime() / 1000;

    const startDateOfCurrentMonth = `1/${this.currentMonthLabelUnixFormat} 14:00:00 GMT+00:00`
    this.currentMonthStartUnix = new Date(startDateOfCurrentMonth).getTime() / 1000;
    const endDateOfCurrentMonth = `${this.currentMonthTotalDays}/${this.currentMonthLabelUnixFormat} 14:00:00 GMT+00:00`
    this.currentMonthEndUnix = new Date(endDateOfCurrentMonth).getTime() / 1000;

    const startDateOfNextMonth = `1/${this.nextMonthLabelUnixFormat} 14:00:00 GMT+00:00`
    this.nextMonthStartUnix = new Date(startDateOfNextMonth).getTime() / 1000;
    const endDateOfNextMonth = `${this.nextMonthTotalDays}/${this.nextMonthLabelUnixFormat} 14:00:00 GMT+00:00`
    this.nextMonthEndUnix = new Date(endDateOfNextMonth).getTime() / 1000;
  }

  calcTodayLinePosition() {
    this.monthDivWidth = this.monthDiv.nativeElement.offsetWidth - this.monthDividerWidth;
    this.pathwayLabelDivLeftPosition = this.pathwayLabelDiv.nativeElement.offsetLeft
    this.previousMonthDayPixels = this.monthDivWidth / (this.previousMonthTotalDays - 1);
    this.currentMonthDayPixels = this.monthDivWidth / (this.currentMonthTotalDays - 1);
    this.nextMonthDayPixels = this.monthDivWidth / (this.nextMonthTotalDays - 1);
    this.leftPixelsTodayLine = this.currentMonthDayPixels * (this.todaysDate.getDate() - 1);
  }

  calcEntryLabelLeft(entryStartUnix, entryStartDateStr) {
    if (entryStartUnix < this.previousMonthStartUnix) {
      return this.calcEntryBarLeft(entryStartUnix, entryStartDateStr) + 15
    } else {
      return this.calcEntryBarLeft(entryStartUnix, entryStartDateStr)
    }
  }

  calcEntryBarLeft(entryStartUnix, entryStartDateStr) {
    const entryStartDate = new Date(entryStartDateStr)
    const entryStartDayNum = entryStartDate.getDate();

    switch (true) {
      // entry starts before previous month
      case entryStartUnix < this.previousMonthStartUnix:
        return 0 - this.leftPixelBufferConstant;
      // entry starts during previous month
      case entryStartUnix >= this.previousMonthStartUnix && entryStartUnix <= this.previousMonthEndUnix:
        return (entryStartDayNum - 1) * this.previousMonthDayPixels
      // entry starts during current month
      case entryStartUnix >= this.currentMonthStartUnix && entryStartUnix <= this.currentMonthEndUnix:
        return this.monthDivWidth + this.monthDividerWidth + ((entryStartDayNum - 1) * this.currentMonthDayPixels)
      // entry starts during next month but not on last day of next month
      case entryStartUnix >= this.nextMonthStartUnix && entryStartUnix < this.nextMonthEndUnix:
        return (this.monthDivWidth * 2) + (this.monthDividerWidth * 2) + ((entryStartDayNum - 1) * this.nextMonthDayPixels)
      // entry starts on last day of next month
      case entryStartUnix >= this.nextMonthStartUnix && entryStartUnix === this.nextMonthEndUnix:
        return (this.monthDivWidth * 2) + (this.monthDividerWidth * 2) + ((entryStartDayNum - 1) * this.nextMonthDayPixels) - 5
      default:
        return 0
    }
  }

  calcEntryBarWidth(entryStartUnix, entryEndUnix, entryStartDateStr, entryEndDateStr) {
    const entryStartDate = new Date(entryStartDateStr)
    const entryStartDayNum = entryStartDate.getDate();
    const entryEndDate = new Date(entryEndDateStr)
    const entryEndDayNum = entryEndDate.getDate();

    switch (true) {
      case this.startsBeforePreviousMonthAndEndsInPreviousMonth(entryStartUnix, entryEndUnix):
        if (entryEndDayNum === 1) {
          return 4 + this.leftPixelBufferConstant
        } else {
          return ((entryEndDayNum - 1) * this.previousMonthDayPixels) + this.leftPixelBufferConstant
        }

      case this.startsBeforePreviousMonthAndEndsInCurrentMonth(entryStartUnix, entryEndUnix):
        return this.monthDivWidth + this.monthDividerWidth + ((entryEndDayNum - 1) * this.currentMonthDayPixels) + this.leftPixelBufferConstant

      case this.startsBeforePreviousMonthAndEndsInNextMonth(entryStartUnix, entryEndUnix):
        return (this.monthDivWidth * 2) + (this.monthDividerWidth * 2) + ((entryEndDayNum - 1) * this.nextMonthDayPixels) + this.leftPixelBufferConstant

      case this.startsBeforePreviousMonthAndEndsAfterNextMonth(entryStartUnix, entryEndUnix):
        return (this.monthDivWidth * 3) + (this.monthDividerWidth * 2) + (this.leftPixelBufferConstant * 2)

      case this.startsInPreviousMonthAndEndsInPreviousMonth(entryStartUnix, entryEndUnix):
        if (entryStartDateStr === entryEndDateStr) {
          return this.previousMonthDayPixels
        } else {
          return (entryEndDayNum - entryStartDayNum) * this.previousMonthDayPixels
        }

      case this.startsInPreviousMonthAndEndsInCurrentMonth(entryStartUnix, entryEndUnix):
        return ((this.previousMonthTotalDays - entryStartDayNum) * this.previousMonthDayPixels) + this.monthDividerWidth + ((entryEndDayNum - 1) * this.currentMonthDayPixels)

      case this.startsInPreviousMonthAndEndsInNextMonth(entryStartUnix, entryEndUnix):
        return ((this.previousMonthTotalDays - entryStartDayNum) * this.previousMonthDayPixels) +
          this.monthDividerWidth +
          this.monthDivWidth +
          this.monthDividerWidth +
          ((entryEndDayNum - 1) * this.nextMonthDayPixels)

      case this.startsInPreviousMonthAndEndsAfterNextMonth(entryStartUnix, entryEndUnix):
        return (this.monthDivWidth * 3) + (this.monthDividerWidth * 2) + (this.leftPixelBufferConstant * 20)

      case this.startsInCurrentMonthAndEndsInCurrentMonth(entryStartUnix, entryEndUnix):
        if (entryStartDateStr === entryEndDateStr) {
          return this.currentMonthDayPixels
        } else {
          return (entryEndDayNum - entryStartDayNum) * this.currentMonthDayPixels
        }

      case this.startsInCurrentMonthAndEndsInNextMonth(entryStartUnix, entryEndUnix):
        return ((this.currentMonthTotalDays - entryStartDayNum) * this.currentMonthDayPixels) + this.monthDividerWidth + ((entryEndDayNum - 1) * this.nextMonthDayPixels)

      case this.startsInCurrentMonthAndEndsAfterNextMonth(entryStartUnix, entryEndUnix):
        return (this.monthDivWidth * 2) + this.monthDividerWidth + this.leftPixelBufferConstant

      case this.startsInNextMonthAndEndsInNextMonth(entryStartUnix, entryEndUnix):
        if (entryStartDateStr === entryEndDateStr) {
          return this.nextMonthDayPixels
        } else {
          return (entryEndDayNum - entryStartDayNum) * this.nextMonthDayPixels
        }

      case this.startsInNextMonthAndEndsAfterNextMonth(entryStartUnix, entryEndUnix):
        return this.monthDivWidth + this.leftPixelBufferConstant
      default:
        return null
    }
  }

  startsBeforePreviousMonthAndEndsInPreviousMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix < this.previousMonthStartUnix && entryEndUnix <= this.previousMonthEndUnix;
  }

  startsBeforePreviousMonthAndEndsInCurrentMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix < this.previousMonthStartUnix && entryEndUnix <= this.currentMonthEndUnix;
  }

  startsBeforePreviousMonthAndEndsInNextMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix < this.previousMonthStartUnix && entryEndUnix <= this.nextMonthEndUnix;
  }

  startsBeforePreviousMonthAndEndsAfterNextMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix < this.previousMonthStartUnix && entryEndUnix > this.nextMonthEndUnix;
  }

  startsInPreviousMonthAndEndsInPreviousMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.previousMonthStartUnix && entryStartUnix <= this.previousMonthEndUnix && entryEndUnix <= this.previousMonthEndUnix;
  }

  startsInPreviousMonthAndEndsInCurrentMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.previousMonthStartUnix && entryStartUnix <= this.previousMonthEndUnix && entryEndUnix <= this.currentMonthEndUnix;
  }

  startsInPreviousMonthAndEndsInNextMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.previousMonthStartUnix && entryStartUnix <= this.previousMonthEndUnix && entryEndUnix <= this.nextMonthEndUnix;
  }

  startsInPreviousMonthAndEndsAfterNextMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.previousMonthStartUnix && entryStartUnix <= this.previousMonthEndUnix && entryEndUnix > this.nextMonthEndUnix;
  }

  startsInCurrentMonthAndEndsInCurrentMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.currentMonthStartUnix && entryStartUnix <= this.currentMonthEndUnix && entryEndUnix <= this.currentMonthEndUnix;
  }

  startsInCurrentMonthAndEndsInNextMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.currentMonthStartUnix && entryStartUnix <= this.currentMonthEndUnix && entryEndUnix <= this.nextMonthEndUnix;
  }

  startsInCurrentMonthAndEndsAfterNextMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.currentMonthStartUnix && entryStartUnix <= this.currentMonthEndUnix && entryEndUnix > this.nextMonthEndUnix;
  }

  startsInNextMonthAndEndsInNextMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.nextMonthStartUnix && entryStartUnix <= this.nextMonthEndUnix && entryEndUnix <= this.nextMonthEndUnix;
  }

  startsInNextMonthAndEndsAfterNextMonth(entryStartUnix, entryEndUnix) {
    return entryStartUnix >= this.nextMonthStartUnix && entryStartUnix <= this.nextMonthEndUnix && entryEndUnix > this.nextMonthEndUnix;
  }

  calculatePathwayContainerHeight(entriesData) {
    let categoryRowCount = 0;
    entriesData.forEach(rowArr => {
      if (rowArr.length > 0) {
        categoryRowCount++
      }
    });
    if (categoryRowCount === 0) {
      return 90
    } else {
      return 55 + (categoryRowCount * 35)
    }
  }

  calEntryLabelWidth(entryStartUnix, entryStartDateStr, nextEntryStartUnix, nextEntryStartDateStr) {
    if (!nextEntryStartUnix) {
      return ((this.monthDivWidth * 3) + (this.monthDividerWidth * 2)) - this.calcEntryLabelLeft(entryStartUnix, entryStartDateStr) - 10
    } else {
      if ((this.calcEntryLabelLeft(nextEntryStartUnix, nextEntryStartDateStr) - this.calcEntryLabelLeft(entryStartUnix, entryStartDateStr) - 15) < 0) {
        return 0
      }
      return this.calcEntryLabelLeft(nextEntryStartUnix, nextEntryStartDateStr) - this.calcEntryLabelLeft(entryStartUnix, entryStartDateStr) - 15;
    }
  }

  selectEntry(entryData) {
    this.infoPanelEntry = entryData;
    this.infoPannelColor = this.pathwayList.filter(data => data.id == entryData.pathwayId)[0].colorCode;
  }

  hexToRgbA(hex: string, alpha: number): string {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
