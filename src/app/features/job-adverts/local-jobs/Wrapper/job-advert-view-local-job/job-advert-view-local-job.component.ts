import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-advert-view-local-job',
  templateUrl: './job-advert-view-local-job.component.html',
  styleUrls: ['./job-advert-view-local-job.component.scss']
})
export class JobAdvertViewNfnJobComponent implements OnInit {
jobId: any;
  constructor(private readonly route: ActivatedRoute,) {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('jobId')) {
        this.jobId = params.jobId;
      }
    });
   }

  ngOnInit() {
  }

}
