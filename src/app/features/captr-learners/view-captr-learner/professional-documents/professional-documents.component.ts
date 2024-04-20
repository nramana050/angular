import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { DocumentsService } from '../documents/documents.service';
import { LearnerNavigation } from '../learner-nav';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { ParticipantNavigation } from 'src/app/features/participant-v2/view-participant/participant-nav';

@Component({
  selector: 'app-professional-documents',
  templateUrl: './professional-documents.component.html',
  styleUrls: ['./professional-documents.component.scss']
})

export class ProfessionalDocumentsComponent implements OnInit {

  name: string;
  prn: string;
  userId: number;
  docType= 'PROFESSIONAL_DOCUMENT';
  url;
  columns: string[] = ['name', 'createdDate', 'description', 'actions'];
  dataSource = new MatTableDataSource<any>();
  pageSize = 10;
  deleteReasons: any[] = [];
  profileUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pageNav: InPageNavService,
    private readonly docService: DocumentsService,
    private readonly learnerNav: LearnerNavigation,
    private readonly snack: SnackBarService,
    private readonly confService: AppConfirmService,
    private readonly router: Router,
    private readonly sessionService: SessionsService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.pageNav.setNavItems(this.learnerNav.learnerSubMenu1);
    this.setTitle();
  }

  ngOnInit() {
    this.fetchDeleteReasons();
    this.fetchDocuments(0, 0);
  }

  ngOnDestroy() {
    this.pageNav.setNavItems(null);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.name}`;
    });
  }
  

  deleteDoc(doc: any) {
    const dialogRef = this.confService.confirm({
      title: `Delete Document`,
      message: `Please select a reason for deleting document`,
      showTextField: false,
      placeholderTextField: '',
      showSelectField: true,
      placeholderSelectField: `Please select`,
      optionsSelectField: this.deleteReasons
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.docService.deleteDocument(doc.id, result)
          .subscribe(res => {
            this.snack.success(`The document is deleted`);
            this.paginator.firstPage();
            this.fetchDocuments(this.paginator.pageSize, this.paginator.pageIndex);
          }, error => {
            this.snack.error(`${error.error.applicationMessage}`);
          });
      }
    });
  }

  private fetchDocuments(pageSize: number, pageIndex: number) {
    this.docService.listOfProfessionalDocuments(this.userId, this.docType, pageSize, pageIndex)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.dataSource.paginator = this.paginator;
      });
  }

  private fetchDeleteReasons() {
    this.docService.fetchDeleteReasons().subscribe(data => {
      this.deleteReasons = data.map(each => {
        return {
          id: each.id,
          reason: each.description
        }
      });
    });
  }

  download(id) {
    this.docService.download(id).subscribe(res => {
    });
  }

  onUploadClicked(){
    this.router.navigate([this.profileUrl+'/professional-document/upload-doc'],  { queryParamsHandling :"merge"});
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

}
