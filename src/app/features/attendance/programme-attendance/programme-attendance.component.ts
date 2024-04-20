import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { IAttendance } from '../attendance-interface';
import { AttendanceService } from '../attendance.service';

const MONTH_YEAR_FORMAT = {
  parse: {
    dateInput: ['MM/YYYY','MMM YYYY'],
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-programme-attendance',
  templateUrl: './programme-attendance.component.html',
  styleUrls: ['./programme-attendance.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMAT},
  ]
})
export class ProgrammeAttendanceComponent implements OnInit {

  attendance: IAttendance[] = [];
  isCompletedExists = false;
  isToBeCompletedExists = false;
  isCompletedLength: number;
  isToBeCompletedLength: number;
  maxDate: Date = new Date();
  monthPicker: any;
  attendenceMonth: any;
  attendanceDate: FormControl = new FormControl();
  minDate: Date = null;

  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  reset() {
    this.attendanceDate.reset();
    this.fetchData();
  }

  onMonthSelected(date: moment.Moment, monthPicker: MatDatepicker<Date>) {
    this.attendanceDate.setValue(date);
    monthPicker.close();
  }
  fetchData() {
    const date: moment.Moment = this.attendanceDate.value;
    let month: number;
    let year: number;
    if (date) {
      month = date.month() + 1;
      year = date.year();
    }
    if(this.attendanceDate.valid){

      this.attendanceService.getAttendances(month, year).subscribe(data =>{
        this.attendance = data.dates;
        this.minDate = new Date(data.minDate);
        this.minDate.setDate(1);
        this.isCompletedAndToBeCompletedExists(this.attendance);
      });
    }
  }
  isCompletedAndToBeCompletedExists(attendance: IAttendance[]){
    this.isCompletedLength = this.attendance.filter(x => x.isCompleted === true).length
    this.isToBeCompletedLength = this.attendance.filter(x => x.isCompleted === false).length
    if(this.isCompletedLength > 0){
      this.isCompletedExists = true;
    }
    if(this.isToBeCompletedLength > 0){
      this.isToBeCompletedExists = true;
    }
  }


}

