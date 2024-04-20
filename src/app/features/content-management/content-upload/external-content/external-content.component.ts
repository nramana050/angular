import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Utility } from '../../../../framework/utils/utility';
import { StepperNavigationService } from '../../../../features/shared/components/stepper-navigation/stepper-navigation.service';
import { AppConfirmService } from '../../../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { ContentManagementService } from '../../content-management.service';
import { ContentManagementSteps } from '../../content.steps';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-external-content',
  templateUrl: './external-content.component.html',
  styleUrls: ['./external-content.component.scss']
})
export class ExternalContentComponent implements OnInit {
  externalModuleData: any = null;
  contentId: number;
  moduleId: number;
  exitButtonBehaviour: any;
  contentUploadURL: any ;
  profileUrl;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNav: StepperNavigationService,
    private readonly contentService: ContentManagementService,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    if(this.profileUrl == 'rws-participant'){
      this.stepperNav.stepper(this.contentSteps.stepsConfig2);
      this.contentUploadURL= '/rws-content-management/upload';
    }else{
      this.stepperNav.stepper(this.contentSteps.stepsConfig);
      this.contentUploadURL= '/content-management/upload';
    } 

    this.route.snapshot.data['title'] = `Resource Upload`;    
    this.route.queryParams.subscribe(params => {
      if (!params.id) {
          this.router.navigate(['../']);
       
      }
      this.contentId = +params.id;
      if (params.moduleId) {
        if(this.profileUrl == 'rws-participant'){
          const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig2, 'id', 'U');
          uploadStep.queryParams = { moduleId: +params.moduleId };
        }else{
          const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
        uploadStep.queryParams = { moduleId: +params.moduleId };
        } 
        
        this.moduleId = +params.moduleId;
      }
    });
  }

  ngOnInit() {
    this.exitButtonBehaviour = this.contentUploadURL;
    if(this.moduleId){
      this.resolveContentModules(this.moduleId);
    }
  }

  resolveContentModules(id: any) {
    this.contentService.getContentModule(id)
      .subscribe((data: any) => {
        this.externalModuleData = data;
        if (data) {
          if(this.profileUrl == 'rws-participant'){
            this.exitButtonBehaviour = '/rws-content-management';
          }else{
            this.exitButtonBehaviour =  '/content-management';
          } 
                   
        } else {
          this.exitButtonBehaviour = this.contentUploadURL;
        }
      },
        error => { this.externalModuleData = null }
      );
  }
  onDeleteClicked(elementId) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete resource module`,
      message: `Are you sure you want to delete ?`,
      showTextField: false,
      placeholderTextField: ''
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.contentService
          .deleteModule({ moduleId: elementId, contentId: this.contentId }).subscribe(
            (response: any) => {    
              this.snackBarService.success(response.applicationMessage);
              if(this.profileUrl == 'rws-participant'){
                const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig2, 'id', 'U');
                uploadStep.state = this.contentUploadURL + '/external/view';
                uploadStep.queryParams = { moduleId: null };
              }else{
                const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
              uploadStep.state = this.contentUploadURL + '/external/view';
              uploadStep.queryParams = { moduleId: null };
              }
             
              this.exitButtonBehaviour = this.contentUploadURL;
              this.router.navigate([this.contentUploadURL + '/external/view'], { queryParams: { id: this.contentId, moduleId: null } });
              this.externalModuleData = null;
              
            },
            error => this.snackBarService.error(`${error.error.applicationMessage}`)
          );
      }
    });
  }
}
