import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { ParticipantNavigation } from '../participant-nav';
import { Location } from '@angular/common';
import { CertificatesService } from './certificates.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';


@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit, OnDestroy {
  usefulcontacts: boolean = false

  userId: number;
  pageSize = 10;
  page = 1;
  fname: string;
  columns: string[] = ['certificate', 'dateAchieved', 'actions'];
  dataSource = new MatTableDataSource<any>();
  profileUrl;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sessionService: SessionsService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly location: Location,
    private readonly certificateService: CertificatesService
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
     this.setTitle();
  }

  ngOnInit(

  ): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.userId = params.id;
      }
    })
    this.fetchDocuments(this.page, this.pageSize);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.fname = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.fname}`;
    });
  }
  onExitClicked() {

    this.router.navigate([this.profileUrl + '/participant-professional-view'], { queryParamsHandling: "merge" });

  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }


  private fetchDocuments(pageIndex: number, pageSize: number) {
    this.certificateService.listOfCertificates(this.userId, pageIndex, pageSize)
      .subscribe(data => {
        this.dataSource.data = data.course;
        this.paginator.length = data.totalpages;
      });
  }

  onPaginateChange(event) {
    this.page = event.pageIndex + 1;
    this.fetchDocuments(this.page, this.pageSize);
    document.querySelector('#certificate').scrollIntoView();
  }



  goToDashboard(route) {

    this.router.navigate([`${route}`], { queryParamsHandling: 'merge' });
  }
  toData(achiveddate) {
    return moment.unix(achiveddate)
  }

  downloadcertificate(courseid: any, certificatecode: any) {
    const payload = { "page": this.page, "pagesize": this.pageSize, "sort": "sortorder", "courseId": courseid, "serviceUserId": this.userId, "certificatecode": certificatecode };
    this.certificateService.downloadCourseCertificate(payload).subscribe(resp => {
      const blob: any = new Blob([resp.body], { type: resp.headers.get("Content-Type") });
      this.download(blob, resp.headers.get("X-Doc-Name"));
    })
  }

  private download(blob: Blob, name: string) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    const filename = name;
    a.download = filename;
    a.target = '_blank';
    const event = new MouseEvent('click', {
      'view': window,
      'bubbles': false,
      'cancelable': true
    });
    a.dispatchEvent(event);
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  goToDigitalCourse() {
    this.router.navigate([this.profileUrl + '/certificates'], { queryParamsHandling: 'merge' });
  }

  goToProgramInfo() {
    this.router.navigate([this.profileUrl + '/certificates/upload-certificates-list'], { queryParamsHandling: 'merge' });
  }

}
