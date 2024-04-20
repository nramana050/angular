import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentManagementSteps } from '../content.steps';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FileUploadOptions, FileTypes, FileFormats } from '../../../features/shared/components/file-upload/file-upload.options';
import { ContentManagementService } from '../content-management.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';



@Component({
  selector: 'app-edit-content-module',
  templateUrl: './edit-content-module.component.html',
  styleUrls: ['./edit-content-module.component.scss']
})
export class EditContentModuleComponent implements OnInit {

  contentId: number;
  moduleId: number;
  contentForm: FormGroup;
  fileCtrl: FormControl;
  isNew: boolean;
  idDisable: boolean;
  maxfileSizeLimit: string;
  moduleType = 'MODULE';
  profileUrl;

  option: FileUploadOptions = {
    maxFileSize: 1073741824,
    label: 'Drag file here or click to browse',
    multiple: false,
    preserveFiles: false,
    showPreviews: false,
    accept: [FileTypes.PNG, FileTypes.JPEG, FileTypes.PDF, FileTypes.DOCX, FileTypes.DOC, FileTypes.XLS,
      FileTypes.PPS_PPT, FileTypes.PPTX, FileTypes.XLSX, FileTypes.MP4, FileTypes.MP3, FileTypes.WAV,
      FileTypes.TXT, FileTypes.ODT, FileTypes.ZIP, FileTypes.HTML, FileTypes.ODS, FileTypes.ODP,
      FileTypes.PUBLISHER, FileTypes.MPEG, FileTypes.EPUB, FileTypes.RTF],  

    formats: [
      FileFormats.FLV, FileFormats.PNG, FileFormats.JPEG, FileFormats.PDF, FileFormats.DOCX,
      FileFormats.DOC_RTF, FileFormats.XLS, FileFormats.PPS_PPT, FileFormats.PPTX, FileFormats.XLSX,
      FileFormats.MP4, FileFormats.MP3, FileFormats.WAV, FileFormats.TXT, FileFormats.ODT, FileFormats.ZIP,
      FileFormats.HTML, FileFormats.ODS, FileFormats.ODP,
      FileFormats.PUBLISHER, FileFormats.MPEG, FileFormats.EPUB, FileFormats.JPG, FileFormats.RTF, FileFormats.PPS]
  };

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNav: StepperNavigationService,
    private readonly contentService: ContentManagementService,
    private readonly snackBarService: SnackBarService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    if(this.profileUrl == 'rws-participant'){
      this.stepperNav.stepper(this.contentSteps.stepsConfig2);
    }else{
      this.stepperNav.stepper(this.contentSteps.stepsConfig);
    } 
  }

  ngOnInit() {
    this.maxfileSizeLimit = environment.fileSizeLimit;
    this.initContentModuleForm();
    this.route.queryParams.subscribe(params => {
      if (!params.id) {
        this.router.navigate(['../']);
      }
      this.contentId = +params.id;
      if (params.moduleId) {
        this.moduleId = +params.moduleId
        this.resolveModuleDetails();
        this.isNew = false;
      } else {
        this.isNew = true;
      }
    });
  }

  ngAfterViewInit(): void {
    const dropzoneInput = document.querySelector('.dropzone-container input.file-input');
    if (dropzoneInput) {
        dropzoneInput.setAttribute('aria-label', 'Drag file here or click to browse');
    }
  }
  
  initContentModuleForm() {
    this.fileCtrl = new FormControl(null, [Validators.required]);
    this.contentForm = this.fb.group({
      moduleName: ['', [Validators.required, Validators.pattern('([A-Za-z0-9\s\!\ \'\?\.\,\'\-\/\(\)]+)'), Validators.minLength(3),
      Validators.maxLength(100)]],
      moduleDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    });
  }

  saveButtonDisabled(): boolean {
    if (this.isNew || this.idDisable) {
      return !this.contentForm.valid || !this.fileCtrl.valid;
    } else {
      return !this.contentForm.valid;
    }
  }

  resolveModuleDetails() {
    this.contentService.getContentModule(this.moduleId)
      .subscribe((data: any) => {
        this.contentForm.patchValue(data);
      })
  }

  onFileSelected(files: File[]) {
    let selectedFile = null;
    if (files.length > 0) {
      selectedFile = files[0];
      this.idDisable = false;
    }
    this.idDisable = true;
    this.fileCtrl.setValue(selectedFile);
  }

  saveContentModule() {
    if (this.isNew) {
      this.createModule();
    } else {
      this.editModule();
    }
  }

  createModule() {
    const data = this.contentForm.getRawValue();
    data.contentId = this.contentId;
    const file = this.fileCtrl.value;
    data.type = this.moduleType;
    this.contentService.createModule(data)
      .subscribe((res: any) => {
        this.snackBarService.success(res.message.applicationMessage);
        if(this.profileUrl == 'rws-participant'){
          this.router.navigate(['/rws-content-management/upload'], { queryParams: { id: this.contentId } });
        }else{
          this.router.navigate(['/content-management/upload'], { queryParams: { id: this.contentId } });
        }
        this.contentService.upload(file, res.responseObject.id).then(response => { })
      }, (error: HttpErrorResponse) => {
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

  editModule() {
    const data = this.contentForm.getRawValue();
    data.contentId = this.contentId;
    data.id = this.moduleId;
    data.type = this.moduleType;
    const file = this.fileCtrl.value;
    data.isFileUpload = (this.fileCtrl.valid && file) ? true : false;
    this.contentService.editModule(data)
      .subscribe((res: any) => {
        this.snackBarService.success(res.message.applicationMessage);
        if(this.profileUrl == 'rws-participant'){
          this.router.navigate(['/rws-content-management/upload'], { queryParams: { id: this.contentId } });
        }else{
          this.router.navigate(['/content-management/upload'], { queryParams: { id: this.contentId } });
        }
        if (this.fileCtrl.valid && file) {
          this.contentService.upload(file, res.responseObject.id).then(response => { });
        }
      }, (error: HttpErrorResponse) => {
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

}
