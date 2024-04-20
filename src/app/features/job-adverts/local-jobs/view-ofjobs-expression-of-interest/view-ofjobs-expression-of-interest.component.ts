import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { InPageNavService } from '../../../shared/components/in-page-nav/in-page-nav.service';
import { AppConfirmService } from '../../../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { JobAdvertsNavigation } from '../../job-adverts.nav';
import { LocalJobsService } from '../local-jobs.service';
import { Utility } from '../../../../framework/utils/utility';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';

@Component({
  selector: 'app-view-ofjobs-expression-of-interest',
  templateUrl: './view-ofjobs-expression-of-interest.component.html',
  styleUrls: ['./view-ofjobs-expression-of-interest.component.scss']
})
export class ViewOFJobsExpressionOfInterestComponent implements OnInit {
  jobData: any = {};
  expressInterestNFNId: any;
  items: any = [];
  disableButtonFlag: any = false;
  prn: any;
  learner: any;
  selectedRadioButtonOption: any;
  preSelectedRadioButtonOption: any;
  radioButtonOptions: any = [];
  jobExpressStatus: any = {};

  constructor(private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly route: ActivatedRoute,
    private readonly localJobService: LocalJobsService,
    private readonly location: Location,
    private readonly appConfirmService: AppConfirmService,
    private readonly inPageNavService: InPageNavService,
    private readonly jobAdvertsNavigation: JobAdvertsNavigation,
    private readonly sessionService: SessionsService
  ) {
    this.inPageNavService.setNavItems(this.jobAdvertsNavigation.jobAdvertPageMenu);
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('expressInterestNFNId')) {
        this.expressInterestNFNId = params.expressInterestNFNId;
      }
    });
    this.route.queryParams.subscribe((params: any) => {
      this.learner = params.suname;
    });
    this.route.snapshot.data['title'] = `${this.learner}`;
  }

  ngOnInit() {
    this.localJobService.getOFJExpressionOfInterestJob(this.expressInterestNFNId).subscribe(data => {
      this.jobData = data;
      this.items = data.attachments;
      if (data.jobStatus === 'Inactive' || data.status !== 'INTERESTED') {
        this.disableButtonFlag = true;
      }
      this.items.forEach(item => {
        item.filename = this.getAttachmentDetails(item);
      });
    });
    this.handleJobExpressionStatus();
  }
  getAttachmentDetails(item) {
    if (item.attachmentType === 'CV') {
      this.localJobService.getCVDetails(item.attachmentId).subscribe(res => {
        item.filename = res.cvName;
      });
    } else if (item.attachmentType === 'DOCUMENT') {
      this.localJobService.getDocument(item.attachmentId).subscribe(res => {
        item.filename = res.name;
      });
    }
    return item.filename;
  }
  download(id, attachmentType) {
    if (attachmentType === 'CV') {
      this.localJobService.downloadCV(id).subscribe(res => {
      });
    } else if (attachmentType === 'DOCUMENT') {
      this.localJobService.downloadDoc(id).subscribe(res => {
      });
    }
  }
  backButton() {
    this.location.back();
  }
  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
  
  respondJob(id, status) {
    if (status) {
      this.preSelectedRadioButtonOption = status;
    }
    const title = (status) ? `Update the Response` : `Select the Response`;
    const dialogRef = this.respondPopupDetails(title, null, this.radioButtonOptions, true, 'Confirm', 'Cancel', this.preSelectedRadioButtonOption);
    dialogRef.subscribe(result => {
      if (result) {
        this.selectedRadioButtonOption = result;
        const actionIdentifier = Utility.getObjectFromArrayByKeyAndValue(this.jobExpressStatus,
          'statusDescription', this.selectedRadioButtonOption).actionIdentifier;
        const title = `Application Response`;
        const dialogMessage = (status) ? 'Job updated' : 'Response sent successfully';
        const message = `Please enter a response to the Service user. Please 
    remember, the Service user will be able to 
    view this response.`;
        const dialogRef = this.popupDetails(title, message, true, 'Respond', 'Cancel');
        dialogRef.subscribe(res => {
          if (res) {
            this.responseHandler(id, dialogMessage, actionIdentifier, res);
          }
        });
      }
    });
  }

  handleJobExpressionStatus() {
    this.localJobService.getJobExpressionStatus().subscribe(data => {
      this.jobExpressStatus = data;
      this.radioButtonOptions = data.map(element => element.statusDescription);
    });
  }

  private responseHandler(id: any, dialogMessage: any, actionIdentifier: any, res: any) {
    if (this.preSelectedRadioButtonOption) {
      this.localJobService.UpdateResponse(id, actionIdentifier, res)
        .subscribe((response) => {
          this.snackBarService.success(dialogMessage);
          this.location.back();
        }, (error: any) => {
          this.resolveError(error);
        });
    } else {
      this.localJobService.saveResponse(id, actionIdentifier, res)
        .subscribe((response) => {
          this.snackBarService.success(dialogMessage);
          this.location.back();
        }, (error: any) => {
          this.resolveError(error);
        });
    }
  }

  resolveError(error: any) {
    if (error.error.errors) {
      this.snackBarService.success(error.error.errorMessage + '. ' +
        error.error.errors[0].errorMessage);
    } else {
      this.snackBarService.success(error.error.errorMessage);
    }
  }
  
  private popupDetails(title: any, message: any, state: any, okButtonName: any,cancelButtonName: any) {
    return this.appConfirmService.confirm({
      title: title,
      message: message,
      okButtonName: okButtonName,
      cancelButtonName: cancelButtonName,
      showTextAreaField: state,
      placeholderTextAreaField: 'Response',
    });
  }

  respondPopupDetails(title: any, message: any, options: any, state: any, okButtonName: any, cancelButtonName: any, preSelectedRadioButtonOption: any) {
    return this.appConfirmService.confirm({
      title: title,
      message: message,
      okButtonName: okButtonName,
      cancelButtonName: cancelButtonName,
      showSelectRadioButtons: state,
      optionsSelectRadioButton: options,
      preSelectedRadioButtonOption: preSelectedRadioButtonOption,
    });
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
}
