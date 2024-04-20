import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { DocumentsService } from './documents.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { LearnerNavigation } from '../learner-nav';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

  @Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss']
  })
  export class DocumentsComponent implements OnInit, OnDestroy {

    fname: string;
    lname: string;
    prn: string;
    userId: number;
    columns: string[] = ['name', 'createdDate', 'description', 'actions'];
    dataSource = new MatTableDataSource<any>();
    pageSize = 10;
    deleteReasons: any[] = [];
    profileUrl;
    id: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
      private readonly location: Location,
      private readonly route: ActivatedRoute,
      private readonly inPageNavService: InPageNavService,
      private readonly docService: DocumentsService,
      private readonly learnerNavigation: LearnerNavigation,
      private readonly snack: SnackBarService,
      private readonly confService: AppConfirmService,
      private readonly sessionService: SessionsService,
      private readonly router: Router,
    ) {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.setTitle();
  }

  ngOnInit() {
    this.fetchDeleteReasons();
    this.fetchDocuments(0, 0);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.fname = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.fname}`;
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

  exit() {
    this.location.back();
  }

  private fetchDocuments(pageSize: number, pageIndex: number) {
    this.docService.listOfDocuments(this.userId, pageSize, pageIndex)
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
      console.log("done");
    });
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
  
  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'], { queryParamsHandling :"merge"});
   }

 }
