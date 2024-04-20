import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { AddRoleSteps } from '../add-roles.steps';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { RoleCreationService } from '../role-creation.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-rbac-permissions',
  templateUrl: './rbac-permissions.component.html',
  styleUrls: ['./rbac-permissions.component.scss']
})
export class RbacPermissionsComponent implements OnInit, AfterViewChecked {

  roleId: number;
  contentForm: FormGroup;
  featureOptions: any[];
  allfeatures: any[];
  size: number = 5000;
  page: number = 0;
  searchData = {
    keyword: ''
  };
  mainCatList: any[];
  showSelectedFeature: boolean = false;
  keywordFilterCtrl: FormControl = new FormControl();
  roleDetail: any;
  refData;
  featuresArray: any[]
  moodleRoleList = [];
  showMoodleRole: boolean;
  isMoodleDisabled: boolean = false;
  selectedFeaturesArray=[]
  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly addRoleSteps: AddRoleSteps,
    private readonly roleCreationService: RoleCreationService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.stepperNavigationService.stepper(this.addRoleSteps.stepsConfig);
  }

  ngOnInit() {
    this.initRbacForm();
    this.keywordFilterCtrl.valueChanges
      .pipe(debounceTime(450))
      .subscribe(value => {
        this.onFilter(value);
      });
    this.getMoodleRoles();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  initRbacForm() {
    this.contentForm = this.formBuilder.group({
      roleId: [null],
      featureIds: this.formBuilder.array([], [Validators.required]),
      isFilterConfig: [null],
      filterConfigIds: this.formBuilder.array([], [Validators.required]),
      isMoodleRole: [null],
      moodleRoleId: [null],
      landingPageFeatureId: [null,[Validators.required]]
    });

    this.roleCreationService.getRefData().subscribe(data => {
      this.refData = data
      this.route.queryParams.subscribe(params => {

        if (!params.id) {
          this.addRoleSteps.stepsConfig.forEach(element => {
            element.enable = true
          })
          this.router.navigateByUrl('/application-setup/role-creation/add-roles');
        } else {
          this.roleId = +params.id;

          this.addRoleSteps.stepsConfig.forEach((element, i) => {
            if (i > 1) {
              element.enable = true
            }
            else {
              element.enable = false
            }

          })
          this.resolveFeatureOptions(true);
        }
      });
    })
  }

  private populatefilterConfigIds() {
    const filterConfigIdsArray = this.contentForm.get('filterConfigIds') as FormArray;
    this.refData.forEach(item => {
      const controlGroup = this.formBuilder.group({
        id: [null],
        featureId: [item.featureId],
        value: [null],
        isActive: [null]
      });
      filterConfigIdsArray.push(controlGroup);
    });
  }

  checkId(i, item) {
    let currnet_group = (this.contentForm.get('filterConfigIds') as FormArray).at(i) as FormGroup;
    if (currnet_group.get('id').value) {
      currnet_group.get('id').patchValue(item.id)
    }
    else {
      currnet_group.get('id').patchValue(null)
    }
  }

  getKeywordForm(keyword: any) {
    return this.formBuilder.group({
      featureIds: new FormControl(keyword.featureId),
      removable: new FormControl(keyword.removable)
    });
  }

  async getSelectedFeatures(id: number) {

    (this.contentForm.get('featureIds') as FormArray).clear();

    await this.roleCreationService.getSelectedFeatures(id).toPromise()
      .then(data => {
        if (data) {
          this.getRoleDetail(data.roleId);
          const list = data.featureIds
          list.forEach((each: string) => {
            const keyword = {
              featureId: each,
              removable: true
            };
            (this.contentForm.get('featureIds') as FormArray).push(this.getKeywordForm(keyword));
          });
          if (data.isFilterConfig) {
            this.contentForm.get('isFilterConfig').patchValue('true')
          }
          else if (data.isFilterConfig == false) {
            this.contentForm.get('isFilterConfig').patchValue('false')
          }
          this.contentForm.get('landingPageFeatureId').patchValue(data.landingPageFeatureId)
          this.patchfilterConfigIds(data);
          this.patchMoodleRole(data);
        }
      });
  }

  async resolveFeatureOptions(initial?: boolean) {

    if (initial) {
      await this.getSelectedFeatures(this.roleId);
    }

    this.roleCreationService.getFeatures(this.searchData).toPromise()
      .then(data => {

        if (!this.searchData.keyword) {
          this.allfeatures = data;
          this.showSelectedFeature = true;
        }

        this.featureOptions = data;
        this.featureOptions.forEach(f => f.id = f.featureId)

        const listSelected = (this.contentForm.get('featureIds') as FormArray).value.map((obj: any) => obj);
        listSelected.forEach(each => {
          const feature = this.featureOptions.find(elem => elem.featureId === each.featureIds);
          this.selectedFeaturesArray.push(feature)
          if (feature) {
            feature.invisible = true;
          }
        });
      });
  }

  select(option: any) {
    option.invisible = true;
    option.removable = true;
    (this.contentForm.get('featureIds') as FormArray).push(this.getKeywordForm(option));
    this.contentForm.get('featureIds').markAsTouched();
    this.featuresArray = this.contentForm.get('featureIds').value.map(s => s.featureIds);
    if(option.featureId !=14)  
    {
      this.selectedFeaturesArray.push(option);
    }
  }

  remove(index, keyword) {
    this.updateKeywordVisibility(keyword.featureIds, true);
    (this.contentForm.get('featureIds') as FormArray).removeAt(index);
    this.contentForm.get('featureIds').markAsTouched();
    this.featuresArray = this.contentForm.get('featureIds').value.map(s => s.featureIds);
    this.selectedFeaturesArray.splice(index, 1);
    if(this.contentForm.get('landingPageFeatureId').value==keyword.featureIds)
    {
      this.contentForm.controls.landingPageFeatureId.reset();
      this.contentForm.controls.landingPageFeatureId.clearValidators();
    }  
  }

  onFilter(value) {
    this.searchData.keyword = value;
    this.resolveFeatureOptions()
  }

  public saveAndNext() {
    const data = this.contentForm.getRawValue();
    data.roleId = this.roleId;
    data.featureIds = data.featureIds.map(obj => obj.featureIds);
    data.filterConfigIds = data.filterConfigIds.map(obj => obj.id);
    data.filterConfigIds = data.filterConfigIds.filter(item => item !== null);
    this.roleCreationService.saveRbacPermission(data).subscribe(
      response => {
        this.router.navigate(['/application-setup/role-creation/role-configuration'], { queryParamsHandling: "merge" });
        this.snackBarService.success(response.message.applicationMessage);
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  updateKeywordVisibility(featureId: string, visibility: boolean): void {
    this.featureOptions
      .filter(each => each.featureId === featureId)
      .forEach(each => each.invisible = !visibility)
  }

  getRoleDetail(roleId: number) {
    this.roleCreationService.getRoleDetails(roleId).subscribe(data => {
      this.roleDetail = data;
      if (data.isCompleted) {
        this.addRoleSteps.stepsConfig.forEach(element => {
          element.enable = false
        })
      }
    })
  }

  patchfilterConfigIds(data) {
    (this.contentForm.get('filterConfigIds') as FormArray).reset()
    this.populatefilterConfigIds();
    this.featuresArray = this.contentForm.get('featureIds').value.map(s => s.featureIds);
    const filterConfigIds = this.refData.map(s => s.id);
    data.filterConfigIds.forEach(element => {
      const index = filterConfigIds.indexOf(element);
      (this.contentForm.get('filterConfigIds') as FormArray).at(index).get('id').patchValue(element);
    })
  }

  checkFeatureIdExists(item): boolean {
    return this.featuresArray.some(data => data === item.featureId);
  }

  isCheckboxSelect() {
    if (this.contentForm.get('isFilterConfig').value) {
      let isCheckbox = "true";
      (this.contentForm.get('filterConfigIds') as FormArray).controls.forEach(element => {
        if (element.get('id').value) {
          isCheckbox = "false"
        }
      });
      if (this.contentForm.get('isFilterConfig').value === "false") {
        isCheckbox = "false"
      }
      return isCheckbox;
    }
  }

  showRadioButon() {
    this.featuresArray = this.contentForm.get('featureIds').value.map(s => s.featureIds);
    return [9, 14, 50, 97, 99, 113, 136].some((element) => this.featuresArray.includes(element));
  }

  onRadioChange() {
    (this.contentForm.get('filterConfigIds') as FormArray).reset()
    this.populatefilterConfigIds();
  }

  getMoodleRoles() {
    this.roleCreationService.getMoodleRoleList().subscribe(resp => {
      this.moodleRoleList = resp
    })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  moodleAccessChange() {
    this.contentForm.controls.moodleRoleId.reset();
    this.contentForm.controls.moodleRoleId.clearValidators();
    this.contentForm.controls.moodleRoleId.updateValueAndValidity();
  }

  patchMoodleRole(data: any) {
    if (data.isMoodleRole !== null) {
      this.isMoodleDisabled = true
    }
    this.contentForm.get('isMoodleRole').patchValue(String(data.isMoodleRole))
    this.contentForm.get('moodleRoleId').patchValue(data.moodleRoleId)
  }
}
