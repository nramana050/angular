import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ReportingService } from './reporting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../framework/service/snack-bar.service';

import { models, Report } from 'powerbi-client';
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import { BehaviorSubject } from 'rxjs';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ReportsNavigation } from './reporting.nav';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit, OnDestroy {

  @ViewChild(PowerBIReportEmbedComponent)
  reportObj!: PowerBIReportEmbedComponent;
  reportClass = "report-container";

  config = {
    type: 'report',
    id: null,
    embedUrl: null,
    tokenType: models.TokenType.Embed,
    accessToken: null,
    settings: {
      filterPaneEnabled: true,
      navContentPaneEnabled: true,
      background: 1,
      layoutType: 0
    }
  };

  showReport;
  reportName = null;
  report: Report;
  isVisible$ = new BehaviorSubject(false);
  reportsNavigation ;
  templateName: string ;

  constructor(
    private readonly reportingService: ReportingService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly dashboardNavigation: ReportsNavigation,
    private readonly sessionService: SessionsService,
    private readonly router : Router
  ) {
    this.inPageNavService.setNavItems(this.dashboardNavigation.reportsInPageMenu);
  }

  ngOnInit() {
    this.resolveTitleAndReportName()
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  resolvePowerBiToken(reportName) {
      this.reportingService.getPowerBiTokens(reportName).subscribe(
        (data: any) => {
          this.showReport = true;
          this.config.accessToken = data.embedToken.token;
          this.config.id = data.id;
          this.config.embedUrl = data.embedUrl;
          this.config.tokenType = models.TokenType.Embed;
        }, error => this.snackBarService.error(error.message)
      );
  }

  resolveSamplePowerBiToken(reportName) {
      this.reportingService.getSamplePowerBiTokens(reportName).subscribe(
        (data: any) => {
          this.config.accessToken = data.accessToken;
          this.config.id = data.ReportId;
          this.config.embedUrl = data.EmbedUrl;
        }, error => this.snackBarService.error(error.message)
      );
    }

  resolveTitleAndReportName() {
    this.route.params.subscribe((params: any) => {
      this.reportName=this.route.snapshot.data.reportName || 'MI_DATA';
      if (params.reportName) {
       if(this.isHavingFeature(92)){
        this.getSampleReports(params);
       }else{
        this.getReports(params)
       }      
      }
      params.reportName ? this.reportName = params.reportName : this.reportName = `establishment`;
    });
  }

  isHavingFeature(fid) {
    return this.sessionService.hasResource([fid.toString()])
  }

  getReports(params){
    let templateName = null;
    switch (params.reportName) {
      case 'mi-data':
        this.route.snapshot.data['title'] = `MI Data`;
         templateName = 'MI_DATA';
         this.showReport  = false;
        break;
      case 'raw-data':
        this.route.snapshot.data['title'] = `Raw Data`;
        templateName = 'RAW_DATA';
        this.showReport  = false
        break;
    }
    this.resolvePowerBiToken(templateName);
  }

  getSampleReports(params){
    this.resolveSamplePowerBiToken(params.reportName);

        switch (params.reportName) {
          case 'establishment':
            this.route.snapshot.data['title'] = `Establishment Efficiency`;
            break;
          case 'provider':
            this.route.snapshot.data['title'] = `Provider Efficiency`;
            break;
          case 'qualifications':
            this.route.snapshot.data['title'] = `Qualifications`;
            break;
          case 'enrolment':
            this.route.snapshot.data['title'] = `Enrolment`;
            break;
          case 'performance':
            this.route.snapshot.data['title'] = `Performance`;
            break;
          case 'course-outcomes':
            this.route.snapshot.data['title'] = `Course Outcomes`;
            break;
          case 'starts-overview':
            this.route.snapshot.data['title'] = `Starts Overview`;
            break;
          case 'assessments':
            this.route.snapshot.data['title'] = `Assessments`;
            break;
          case 'english-maths-assessments':
            this.route.snapshot.data['title'] = `English & Maths Assessments`;
            break;
          case 'health-issues':
            this.route.snapshot.data['title'] = `Health Issues`;
            break;
          case 'league-tables':
            this.route.snapshot.data['title'] = `League Tables`;
            break;
          case 'withdrawal-reasons':
            this.route.snapshot.data['title'] = `Withdrawal Reasons`;
            break;
          case 'contracts1':
            this.route.snapshot.data['title'] = `Report 3`;
            break;
           case 'contracts2':
            this.route.snapshot.data['title'] = `Report 4 `;
            break;
          case 'ycs-kpi':
            this.route.snapshot.data['title'] = `YCS KPI's`;
            break;
          case 'ycs-starts-overview':
            this.route.snapshot.data['title'] = `Starts Overview`;
            break;
          case 'ycs-assessments':
            this.route.snapshot.data['title'] = `Assessments`;
            break;
          case 'ycs-health-issues':
            this.route.snapshot.data['title'] = `Health Issues`;
            break;
          case 'ycs-enrolment':
            this.route.snapshot.data['title'] = `Enrolment`;
            break;
          case 'ycs-english-maths-assessments':
            this.route.snapshot.data['title'] = `English & Maths Assessments`;
            break;
          case 'ycs-course-outcomes':
            this.route.snapshot.data['title'] = `Course Outcomes`;
            break;
          case 'ycs-withdrawl-reasons':
            this.route.snapshot.data['title'] = `Withdrawal Reasons`;
            break;
          case 'ycs-learner-overview':
              this.route.snapshot.data['title'] = `Learner Overview`;
            break;
          case 'ycs-classroom-list':
              this.route.snapshot.data['title'] = 'Classroom List';
            break;
          case 'ycs-teacher-assessment':
              this.route.snapshot.data['title'] = `Teacher Assessment`;
              break;
          case 'ycs-engagement':
              this.route.snapshot.data['title'] = `Engagement`;
              break;
          case 'ycs-learner-plan-completions':
              this.route.snapshot.data['title'] = `Learner Plan Completions`;
              break;
          case 'ycs-hours-in-education':
              this.route.snapshot.data['title'] = `Hours In Education`;
              break;
          case 'ycs-course-list':
              this.route.snapshot.data['title'] = `Course List`;
              break;
          case "report1":
              this.route.snapshot.data["title"] = `Report 1`;
              break;
          case "report2":
              this.route.snapshot.data["title"] = `Report 2`;
              break;
          case "dtm-kpi":
              this.route.snapshot.data["title"] = `DPM KPIs`;
              break;
          case "learner-log-ins":
              this.route.snapshot.data["title"] = `Learner Log Ins`;
              break;
          case "pes-dashboard":
              this.route.snapshot.data["title"] = `Report 5`;
              break;
          case "wales-estate-dashboards":
              this.route.snapshot.data["title"] = `Report 6`;
              break;
  }
}

goToTab( route ){
  this.router.navigate([`${route}`], { queryParamsHandling: 'merge' });
}
}
