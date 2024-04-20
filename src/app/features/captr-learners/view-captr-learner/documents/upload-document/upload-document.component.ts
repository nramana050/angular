import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DocumentsService } from '../documents.service';
import { ErrorInput } from 'src/app/features/shared/components/file-upload/file-upload.component';
import { FileUploadDocumentOptions } from 'src/app/features/shared/components/file-upload/file-upload.options';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {

  contentForm: FormGroup;
  fileCtrl: FormControl;
  isNew: boolean = true;

  userId: number;
  fname: string;
  lname: string;
  prn: string;
  docId: number;

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
    private readonly docService: DocumentsService,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly appConfirmService: AppConfirmService,
  ) {
    this.setTitle();
  }
  
  ngOnInit() {
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.initContentModuleForm();
    this.getDocumentDetails();
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
      description: ['', [Validators.minLength(1), Validators.maxLength(100)]],
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
    const formData = this.parseData(this.fileCtrl.value);
    this.docService.upload(this.userId, formData, 'POST')
      .then(res => {
        this.snackBarService.success('File uploaded successfully');
        this.returnToDocuments();
      }).catch(error => {
        if (error.httpStatusCode === 409) {
          this.showExistingPopup(formData);
        } else {
          this.snackBarService.error(`${error.error.applicationMessage}`);
        }
      });
  }

  private getDocumentDetails() {
    if (this.docId) {
      this.isNew = false;
      this.docService.fetchDocument(this.docId).subscribe(data => {
        this.contentForm.patchValue({
          id: data.id,
          fileName: data.name,
          description: data.description
        })
      });
    }
  }

  private showExistingPopup(formData: FormData) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Error Message`,
      message: `File with the same name already exists. Do you want to replace it?`,
      cancelButtonName: 'No',
      okButtonName:  'Yes',
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.docService.upload(this.userId, formData, 'PUT')
          .then(res => {
            this.snackBarService.success('File replaced successfully');
            this.returnToDocuments();
          }).catch(error => {
            this.snackBarService.error(`${error.error.applicationMessage}`);
          });
      }
    });
  }

  private parseData(file: File): FormData {
    const data = this.contentForm.getRawValue();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentId', data.id);
    formData.append('description', data.description);
    formData.append('fileName', data.fileName);
    return formData;
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

}
