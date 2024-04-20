import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentManagementSteps } from '../content.steps';
import { FormControl, Validators } from '@angular/forms';
import { ContentManagementService } from '../content-management.service';
import { IEstablishment, ILotname } from '../content.interface';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';


@Component({
  selector: 'app-edit-content-establishment',
  templateUrl: './edit-content-establishment.component.html',
  styleUrls: ['./edit-content-establishment.component.scss']
})
export class EditContentEstablishmentComponent implements OnInit {

  public contentId: number;
  public selected: FormControl = new FormControl([], [Validators.required]);

  public lotNames: ILotname[] = [];
  public organizations: IEstablishment[] = [];
  public preSelected: IEstablishment[] = [];
  profileUrl;
  byclient;
  Team;
  header= "Team(s)*";

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNavService: StepperNavigationService,
    private readonly contentService: ContentManagementService
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
     if(this.profileUrl == 'rws-participant'){
            this.header= "Programme(s)*";
      this.stepperNavService.stepper(this.contentSteps.stepsConfig2);
     }else{
      this.stepperNavService.stepper(this.contentSteps.stepsConfig);
     }
  }

  ngOnInit() {
    this.initEstablishmentForm();
  }

  initEstablishmentForm() {
    this.route.queryParams.subscribe(params => {

      if (params.moduleId) {
        if(this.profileUrl == 'rws-participant'){
          const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig2, 'id', 'U');
          uploadStep.queryParams = { moduleId:params.moduleId };
         }else{
          const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
          uploadStep.queryParams = { moduleId:params.moduleId };
         }
      }

      if (params.id) {
        this.contentId = +params.id;
        this.initOrganizationList();
      } else {
        this.router.navigateByUrl(this.profileUrl);
      }
    });
  }

  async getSelectedOrgs() {
    this.selected.setValue([]);
    await this.contentService.getSelectedOrganizations(this.contentId).toPromise()
      .then(data => {
        this.preSelected = data.orgUnitIds.map((id: number) => {
          return { id: id };
        });
        this.selected.setValue(data.orgUnitIds);
      });
  }

  async initOrganizationList() {
    await this.getSelectedOrgs();
    this.contentService.getAllOrganizations().subscribe((res: any) => {
      this.lotNames = res.lotNames;
      this.organizations = res.organizations;
    });
  }

  public saveOrganizations() {
    const content = {
      contentId: this.contentId,
      orgUnitIds: this.selected.value
    }
    this.contentService.saveContentOrganizations(content).subscribe(
      response => {
        if(this.profileUrl == 'rws-participant'){
          this.router.navigate(['/rws-content-management/category'], { queryParams: { id: this.contentId } });
        }else{
          this.router.navigate(['/content-management/category'], { queryParams: { id: this.contentId } });
        }
        this.snackBarService.success(response.applicationMessage);
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  updateOrganizations(data: any[]) {
    this.selected.setValue(Object.assign(data.map(org => org.id)));
  }

}