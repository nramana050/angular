import { Component, Inject, OnInit } from '@angular/core';
import { JobReadinessService } from '../job-readiness.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-job-readiness-history',
  templateUrl: './job-readiness-history.component.html',
  styleUrls: ['./job-readiness-history.component.scss']
})
export class JobReadinessHistoryComponent implements OnInit {

  historyDataList: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { jrId: number, userId: number },
    private readonly jobReadinessService: JobReadinessService,
  ) { }

  ngOnInit(): void {
    this.getJobReadinessHistory();
  }

  getJobReadinessHistory() {
    this.jobReadinessService.getHistory(this.data.jrId, this.data.userId).subscribe(resp => {
      this.historyDataList = resp;
    })
  }

}
