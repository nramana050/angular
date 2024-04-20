import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { StepperNavigationService } from '../../../../features/shared/components/stepper-navigation/stepper-navigation.service';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { ContentManagementService } from '../../content-management.service';
import { ContentManagementSteps } from '../../content.steps';
import { Utility } from '../../../../framework/utils/utility';
import { ValidatorService } from '../../../../framework/components/form-control-messages/validator.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-upload-external-content',
  templateUrl: './upload-external-content.component.html',
  styleUrls: ['./upload-external-content.component.scss']
})
export class UploadExternalContentComponent implements OnInit {
  contentId: number;
  contentForm: FormGroup;
  moduleType: any = 'URL';
  navigateToView: any;
  moduleId: any;
  isNew: boolean;
  exitButtonNavURL: any;
  profileUrl;
  contentUploadURL;
  
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNav: StepperNavigationService,
    private readonly contentService: ContentManagementService,
    private readonly snackBarService: SnackBarService,
    private readonly location: Location,
    ) 
  {

    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

    if(this.profileUrl == 'rws-participant'){
      this.stepperNav.stepper(this.contentSteps.stepsConfig2);
      this.navigateToView = '/rws-content-management/upload/external/view';
      this.contentUploadURL = '/rws-content-management/upload';
    }else{
      this.stepperNav.stepper(this.contentSteps.stepsConfig);
      this.navigateToView = '/content-management/upload/external/view';
      this.contentUploadURL = '/content-management/upload';
    } 

    
    this.route.snapshot.data['title'] = `Resource Upload`;
    

    const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
        uploadStep.state = this.contentUploadURL;
    this.route.queryParams.subscribe(params => {
      if (!params.id) {
        this.router.navigate(['../']);
      }
      this.contentId = +params.id;
      if (params.moduleId) {
        this.exitButtonNavURL = './view';
        this.moduleId = +params.moduleId
        this.resolveModuleDetails();
        this.isNew = false;
      } else {
        if(this.profileUrl == 'rws-participant'){
        this.exitButtonNavURL = '/rws-content-management/upload';
        }else{
          this.exitButtonNavURL = '/content-management/upload';
        }
        this.isNew = true;
      }
    });
    
   }

  ngOnInit() {
    this.initContentModuleForm();
  }

  initContentModuleForm() {
    this.contentForm = this.fb.group({
      moduleName: ['', [Validators.required, Validators.pattern("([A-Za-z0-9\s\!\ \'\?\.\,\-\/\(\)]+)"), Validators.minLength(3),
       Validators.maxLength(100)]],
       path: ['', [Validators.required, ValidatorService.urlValidator(), Validators.maxLength(255)]],
       moduleDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    });
  }

  saveButtonDisabled(): boolean {
      return !this.contentForm.valid;
    }

    onSubmit(data) {
      if (this.isNew) {
        this.createModule(data);
      } else {
        this.editModule(data);
      }
    }
    createModule(form: FormGroup) {
      const data = form.getRawValue();
      data.contentId = this.contentId;
      data.type = this.moduleType;
      this.contentService.createModule(data)
        .subscribe((res: any) => {
          const moduleId = res.responseObject.id;
          this.snackBarService.success(res.message.applicationMessage);
          this.router.navigate([this.navigateToView], { queryParams: { id: this.contentId, moduleId: moduleId} });
        }, (error: HttpErrorResponse) => {
          this.snackBarService.error(error.error.applicationMessage);
        });
    }
    editModule(form: FormGroup) {
      const data = form.getRawValue();
      data.contentId = this.contentId;
      data.type = this.moduleType;
      data.id = this.moduleId;
      data.isFileUpload = false;
      this.contentService.editModule(data)
        .subscribe((res: any) => {
          this.snackBarService.success(res.message.applicationMessage);
          this.router.navigate([this.navigateToView], { queryParams: { id: this.contentId, moduleId: this.moduleId} });
        }, (error: HttpErrorResponse) => {
          this.snackBarService.error(error.error.applicationMessage);
        });
    }
    resolveModuleDetails() {
      this.contentService.getContentModule(this.moduleId)
        .subscribe((data: any) => {
          this.contentForm.patchValue(data);
        })
    }
  }

