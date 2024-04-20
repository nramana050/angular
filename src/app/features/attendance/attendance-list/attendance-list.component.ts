import { Content } from '@angular/compiler/src/render3/r3_ast';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Utility } from 'src/app/framework/utils/utility';
import { SessionsService } from '../../shared/services/sessions.service';
import { AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.scss']
})
export class AttendanceListComponent implements OnInit  {

  displayedColumns: string[] = ['courseName', 'programmeName', 'cohortNumber', 'session', 'occurred', 'allocated', 'attended', 'action'];
  dataSource = new MatTableDataSource<Content>();
  date: string;
  filterBy = null;
  isEditable = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly attendanceService: AttendanceService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.day) {
        this.date = params.day;
        this.getSessions();
      }
    });
  }


  typeChange(value) {
    if(value) {
      this.dataSource.filter = value
    } else {
      this.dataSource.filter = '';
    }
  }
  onFilter(value) {
    this.filterBy = value;
    this.getSessions();
  }
  getSessions() {
    this.attendanceService.getSessionsByDate(this.date, this.filterBy).subscribe(data=>{
      this.dataSource.data = data;
    });
  }
  clearFilter() {
    this.onFilter('');
    this.dataSource.filter = '';
  }
}
