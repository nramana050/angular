import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IEstablishment, ILotname } from '../../content-management/content.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentManagementSteps } from '../../content-management/content.steps';
import { ContentManagementService } from '../../content-management/content-management.service';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-edit-rws-content-establishment',
  templateUrl: './edit-rws-content-establishment.component.html',
  styleUrls: ['./edit-rws-content-establishment.component.scss']
})
export class EditRwsContentEstablishmentComponent implements OnInit {

  public contentId: number;
  public selected: FormControl = new FormControl([], [Validators.required]);

  public lotNames: ILotname[] = [];
  public organizations: IEstablishment[] = [];
  public preSelected: IEstablishment[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNavService: StepperNavigationService,
    private readonly contentService: ContentManagementService
  ) {
    this.stepperNavService.stepper(this.contentSteps.stepsConfig);
  }

  ngOnInit() {
    this.initEstablishmentForm();
  }

  initEstablishmentForm() {
    this.route.queryParams.subscribe(params => {

      if (params.moduleId) {
        const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
        uploadStep.queryParams = { moduleId:params.moduleId };
      }

      if (params.id) {
        this.contentId = +params.id;
        this.initOrganizationList();
      } else {
        this.router.navigateByUrl('/content-management');
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
        this.router.navigate(['/rws-content-management/keyword'], { queryParams: { id: this.contentId } });
        this.snackBarService.success(response.applicationMessage);
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  updateOrganizations(data: any[]) {
    this.selected.setValue(Object.assign(data.map(org => org.id)));
  }

}
