import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentManagementSteps } from '../content.steps';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { ContentManagementService } from '../content-management.service';
import { Utility } from '../../../framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.scss']
})
export class ContentUploadComponent implements OnInit {

  selectedContentType: string;
  contentType: string[] = ['internal', 'external'];
  externalModuleType: any = 'URL';
  contentId: number;
  disableButton: any;
  contents: any = {};
  selectedModule: any;
  moduleId: any;
  contentUploadURL: any;
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
      this.contentUploadURL = '/rws-content-management/upload';
      const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig2, 'id', 'U');
      uploadStep.state = this.contentUploadURL;
      uploadStep.queryParams = {moduleId: null};
     }else{
      this.contentUploadURL = '/content-management/upload';
      const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
      uploadStep.state = this.contentUploadURL;
      uploadStep.queryParams = {moduleId: null};
     }

   
    this.route.snapshot.data['title'] = `Resource Upload`;
    if(this.profileUrl == 'rws-participant'){
      this.stepperNav.stepper(this.contentSteps.stepsConfig2);
    }else{
      this.stepperNav.stepper(this.contentSteps.stepsConfig);
    } 
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (!params.id) {
        this.router.navigate(['../']);
      }
      this.contentId = +params.id;     
    });
    this.resolveContentDetails();
  }

  resolveContentDetails() {
    this.contentService.getContent(this.contentId).subscribe(data => {
      this.contents = data;
      if (this.contents.modules.length > 0) {
        this.moduleId = this.contents.modules[0].id;
        if(this.contents.modules[0].type === this.externalModuleType){
           this.router.navigate([this.contentUploadURL + '/' +this.contentType[1]+'/view'],{ queryParams: { id: this.contentId, moduleId: this.moduleId} });
        }else{
          this.router.navigate([this.contentUploadURL + '/' +this.contentType[0]],{ queryParams: { id: this.contentId} });
        }
      }
    });
  }

}