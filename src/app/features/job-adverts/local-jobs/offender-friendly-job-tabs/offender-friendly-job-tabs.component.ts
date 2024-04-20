import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'offender-friendly-job-tabs',
  templateUrl: './offender-friendly-job-tabs.component.html',
  styleUrls: ['./offender-friendly-job-tabs.component.scss']
})
export class OffenderFriendlyJobTabsComponent implements OnInit {
  constructor(private readonly router: Router,
    private readonly route: ActivatedRoute,) { }

  ngOnInit() {
  }
}
