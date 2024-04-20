import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html'
})
export class MarkAttendanceComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: any) => {
      const date: moment.Moment = moment(params.day, 'YYYY-MM-DD');
      this.route.snapshot.data['title'] = date.format('dddd, DD MMMM YYYY');
    });
  }

  ngOnInit(): void {
    // this is intentional
  }

}
