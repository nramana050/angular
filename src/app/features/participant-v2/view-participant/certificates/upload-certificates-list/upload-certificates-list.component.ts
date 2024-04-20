
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { CertificatesService } from '../certificates.service';

@Component({
  selector: 'app-upload-certificates-list',
  templateUrl: './upload-certificates-list.component.html',
  styleUrls: ['./upload-certificates-list.component.scss']
})
export class UploadCertificatesListComponent implements OnInit, OnDestroy {

  columns: string[] = ['certificate', 'dateAchieved', 'actions'];
  dataSource = new MatTableDataSource<any>();
  profileUrl;
  userId: number;
  pageSize = 10;
  fname:string;
  page = 0;
  docType = 'CERTIFICATES'
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private readonly inPageNavService: InPageNavService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionService: SessionsService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly certificateService: CertificatesService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.userId = params.id;
      }
    })
    this.fetchDocuments(this.page,this.pageSize);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.fname = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.fname}`;
    });
  }


  onPaginateChange(event) {
    this.page = event.pageIndex ;
    this.fetchDocuments(this.page, this.pageSize);
    document.querySelector('#certificate').scrollIntoView();
  }
  private fetchDocuments(page: number, pageSize: number) {
    this.certificateService.listOfProfessionalDocuments(this.userId, this.docType,pageSize, page)
      .subscribe(data => {
        window.scroll(1,1);
        data.content = data.content.map(item => ({ ...item, name: item.name.substring(0, item.name.lastIndexOf('.')) }));
        this.dataSource.data = data.content;
        this.paginator.length = data.totalElements;
      
      });
  }

  goToDigitalCourse() {
    this.router.navigate([this.profileUrl + '/certificates'], { queryParamsHandling: "merge" });
  }

  goToProgramInfo() {
    this.router.navigate([this.profileUrl + 'person-supported/certificates/upload-certificates-list'], { queryParamsHandling: "merge" });
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

  onExitClicked() {

    this.router.navigate([this.profileUrl + '/participant-professional-view'], { queryParamsHandling: "merge" });

  }
  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }





  download(id) {
    this.certificateService.download(id).subscribe(data => {
    })
  }
  
}
