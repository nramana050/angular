import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../application.service';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { InPageNavService } from '../../shared/components/in-page-nav/in-page-nav.service';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { JobDetails } from '../../captr-learners/view-captr-learner/job-activity/view-favourites-job/view-favourites-jobs/JobDetails.interface';


@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss']
})
export class ViewApplicationComponent implements OnInit {
  application: any;
  job: JobDetails;
  earliestReleaseDate: any;
  applicationId: any;
  disableButtonFlag: any = false;
  jobId: string;
  items: any;
  displayedColumns: string[] = ['File', 'action'];
  dataSource = new MatTableDataSource<Content>();


  constructor(private readonly applicationService: ApplicationService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly location: Location,
    private readonly inPageNavService: InPageNavService,
    private readonly appConfirmService: AppConfirmService,
    private readonly snack: MatSnackBar, ) {
    this.route.params.subscribe((params: any) => {
      this.applicationId = params.id;
      if (params.hasOwnProperty('id')) {
        this.getApplication(this.applicationId);
      }
    });
    this.route.queryParams.subscribe((params: any) => {
      this.route.snapshot.data['title'] = params.serviceUser;
    });
  }

  ngOnInit() { }

  getApplication(id) {
    this.applicationService.getApplication(id)
      .subscribe(application => {
        this.application = application;
        this.job = application.job;
        this.items = application.attachments;
        this.earliestReleaseDate = application.earliestReleaseDate;
        if (application.jobApplicationStatus.statusDescription !== 'SUBMITTED') {
          this.disableButtonFlag = true;
        }
        this.items.forEach(item => {
          item.filename = this.getAttachmentDetails(item);
        });
      },
        error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
          this.location.back();
        });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  goBack() {
    this.location.back();
  }

  getAttachmentDetails(item) {
    if (item.attachmentType === 'CV') {
      this.applicationService.getCVDetails(item.attachmentId).subscribe(res => {
        item.filename = res.cvName;
      });
    } else if (item.attachmentType === 'DOCUMENT') {
      this.applicationService.getDocument(item.attachmentId).subscribe(res => {
        item.filename = res.name;
      });
    }
    return item.filename;
  }

  download(id, attachmentType) {
    if (attachmentType === 'CV') {
      this.applicationService.downloadCV(id).subscribe(res => {
      });
    } else if (attachmentType === 'DOCUMENT') {
      this.applicationService.downloadDoc(id).subscribe(res => {
      });
    }
  }


  onDeleteClicked(id) {
    const title = `Delete Attachment`;
    const message = `Are you sure you want to delete Attachment?`;
    const dialogRef = this.popupDetails(title, message);
    dialogRef.subscribe(result => {
      if (result) {
        this.applicationService.deleteAttachment(id, this.application.id)
          .subscribe((data) => {
            this.getApplication(this.applicationId);
            this.snack.open('Attachment deleted successfully!', 'Dismiss', { duration: 4000 });
          },
            (error: any) => {
              this.snack.open(error.errorMessage, 'Dismiss', { duration: 6000 });
            }
          );
      }
    });
  }

  acceptJob(id) {
    const title = `Approve Application`;
    const message = `Please confirm you are happy to forward this job application to the advertiser.`;
    const dialogRef = this.popupDetails(title, message);
    const dialogMessage = 'Job approved for forwarding';
    const actionIdentifier = 3;
    this.responseHandler(id, dialogMessage, actionIdentifier, dialogRef);
  }
  declineJob(id) {
    const title = `Decline Application`;
    const message = `Please confirm you are not happy to forward this job application to the advertiser.`;
    const dialogRef = this.popupDetails(title, message);
    const dialogMessage = 'Job declined for forwarding';
    const actionIdentifier = 4;
    this.responseHandler(id, dialogMessage, actionIdentifier, dialogRef);
  }
  private responseHandler(id: any, dialogMessage: any, actionIdentifier: any, dialogRef: any) {
    dialogRef.subscribe(result => {
      if (result) {
        this.applicationService.updateApplicationStatus(id, actionIdentifier)
          .subscribe((response) => {
            this.disableButtonFlag = true;
            this.snack.open(dialogMessage, 'Dismiss', { duration: 4000 });
            this.location.back();
          }, (error: any) => {
            this.snack.open(error.errorMessage, 'Dismiss', { duration: 6000 });
          });
      }
    });
  }
  private popupDetails(title: any, message: any) {
    return this.appConfirmService.confirm({
      title: title,
      message: message,
      okButtonLabel: 'Yes',
      cancelButtonLabel: 'No'
    });
  }
}
