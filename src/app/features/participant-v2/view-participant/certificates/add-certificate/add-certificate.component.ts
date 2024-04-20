import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from 'angular-calendar';
import { DocumentsService } from 'src/app/features/captr-learners/view-captr-learner/documents/documents.service';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { ErrorInput } from 'src/app/features/shared/components/file-upload/file-upload.component';
import { FileUploadDocumentOptions } from 'src/app/features/shared/components/file-upload/file-upload.options';
import { FormUtil } from 'src/app/features/shared/components/form-control/form.util';
import { ValidationService } from 'src/app/features/shared/components/form-control/validation.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ParticipantNavigation } from '../../participant-nav';
import { CertificatesService } from '../certificates.service';

@Component({
  selector: 'app-add-certificate',
  templateUrl: './add-certificate.component.html',
  styleUrls: ['./add-certificate.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddCertificateComponent implements OnInit,OnDestroy {

  contentForm: FormGroup;
  fileCtrl: FormControl;
  isNew: boolean = true;

  maxDateOFJoinedUnityWork = new Date(new Date().setFullYear(new Date().getFullYear()));
  minDateOFJoinedUnityWork = new Date(new Date().setFullYear(new Date().getFullYear() - 100));


  userId: number;
  fname: string;
  lname: string;
  prn: string;
  docId: number;
 profileUrl ;
  
  errorInput: ErrorInput[] = [
    { id: 'filesize', message: `This file is too large to upload. The maximum supported file size is 16MB` }
  ]

  option: FileUploadDocumentOptions = {
    maxFileSize: 16777216,
    label: 'Drag file here or click to browse',
    multiple: false,
    preserveFiles: false,
    showPreviews: false,
  }

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly docService: CertificatesService,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly appConfirmService: AppConfirmService,
    private readonly sessionService: SessionsService,
  ) {
    this.setTitle();
  }
  
  ngOnInit() {
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
  
    this.initContentModuleForm();
  }

  ngAfterViewInit(): void {
    const dropzoneInput = document.querySelector('.dropzone-container input.file-input');
    if (dropzoneInput) {
        dropzoneInput.setAttribute('aria-label', 'Drag file here or click to browse');
    }
  }
  
  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.fname = params.name;
        this.userId = params.id;
        this.docId = params.doc;
      }
      this.route.snapshot.data.title = `${this.fname}`;
    });
  }

  initContentModuleForm() {
    this.fileCtrl = new FormControl(null, [Validators.required]);
    this.contentForm = this.fb.group({
      id: [''],
      fileName: ['', [Validators.required, Validators.pattern(/^[^<>:"\/\\\|\?\*]*$/), Validators.minLength(1),
      Validators.maxLength(30)]],
      achievedDate: [null, [Validators.required]]
    });
  }

  saveButtonDisabled(): boolean {
    if (this.isNew) {
      return !this.contentForm.valid || !this.fileCtrl.valid;
    } else {
      return !this.contentForm.valid;
    }
  }

  onFileSelected(files: File[]) {
    let selectedFile = null;
    if (files.length > 0) {
      selectedFile = files[0];
    }
    this.fileCtrl.setValue(selectedFile);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  uploadDocument() {
    if (this.contentForm.valid) {
      const data = this.parseSaveData();
      FormUtil.clearAllValidatorsAndErrors(this.contentForm);
      
      console.log('data==>',data);
      
      this.docService.uploadDocument(this.userId,data, 'POST')
      .then(res => {
        this.snackBarService.success('File uploaded successfully');
        this.returnToDocuments();
      }).catch(error => {
        if (error.httpStatusCode === 409) {
          this.showExistingPopup(data);
        } else {
          this.snackBarService.error(`${error.error.applicationMessage}`);
        }
      });
    }
  }
  private showExistingPopup(data) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Error Message`,
      message: `File with the same name already exists. Do you want to replace it?`,
      cancelButtonName: 'No',
      okButtonName:  'Yes',
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.docService.uploadDocument(this.userId,data, 'PUT')
          .then(res => {
            this.snackBarService.success('File replaced successfully');
            this.returnToDocuments();
          }).catch(error => {
            this.snackBarService.error(`${error.error.applicationMessage}`);
          });
      }
    });
  }

  private parseSaveData(): any {
    const data = this.contentForm.getRawValue();
    data.achievedDate= Utility.transformDateToString(data.achievedDate);
    data.file = this.fileCtrl.value;
    return data;
  }


  returnToDocuments() {
    this.router.navigate(['..'], {
      relativeTo: this.route,
      queryParams: {
        id: this.userId,
        name: this.fname,
      }
    });
  }


  goToDigitalCourse(){ 
    this.router.navigate([this.profileUrl+'/certificates'],{ queryParamsHandling :"merge"});
}

goToProgramInfo(){
  this.router.navigate([this.profileUrl+'person-supported/certificates/upload-certificates-list'],{ queryParamsHandling :"merge"});
}

isAuthorized(fid, opId) {
  return this.sessionService.hasResource([fid.toString(), opId.toString()])
}
}
