import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAuthorNameList } from '../../content-management/edit-content/iauthor-name-list';
import { Observable } from 'rxjs';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { RwsContentManagementService } from '../../rws-content-management/rws-content-management.service';
import { Utility } from '../../../framework/utils/utility';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../../framework/components/date-adapter/date-adapter';
import { ContentManagementSteps } from '../../content-management/content.steps';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-edit-rws-content-management',
  templateUrl: './edit-rws-content-management.component.html',
  styleUrls: ['./edit-rws-content-management.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class EditRwsContentManagementComponent implements OnInit {

  private contentId: number;
  manageContentForm: FormGroup;
  isNew = false;
  learningStyleNameList: any[];
  authorNameList: IAuthorNameList[] = [];
  filteredAuthorNameList: Observable<IAuthorNameList[]>;

  minStartDate: Date;
  minEndDate: Date;
  data;
  allRefdata;
  profileUrl;
 

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly rwsContentManagementService: RwsContentManagementService,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
  
    this.stepperNavigationService.stepper(this.contentSteps.stepsConfig2);
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.minEndDate.setDate(this.minStartDate.getDate() + 1);
    this.rwsContentManagementService.getRefData().subscribe( data => {
     this.allRefdata =data;     
    });
  }

  ngOnInit() {
    this.initContentForm();
    this.getLearningStyleList();
    this.rwsContentManagementService.getAllAuthorList().subscribe(
      authorList => {
        this.authorNameList = authorList;
        return this.authorNameList;
      });
    this.filteredAuthorNameList = this.manageContentForm.controls.author.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): IAuthorNameList[] {
    if(!value) {
      return this.authorNameList;;
    }
    const filterValue = value.toLowerCase(); 
    return this.authorNameList.filter((option: any) => option.authorName.toLowerCase().includes(filterValue));
  }

  initContentForm() {
    this.manageContentForm = this.fb.group({
      contentId: [null],
      title: [null, [Validators.required, Validators.pattern("([A-Za-z0-9\s\!\ \'\.\,\-\/]+)")]],
      author: [null,[Validators.pattern('\\s*([A-Za-z\\s]+)*\\s*')]],
      resourceTypeId: ['', Validators.required],
      description: ['', Validators.required],
      curationStartDate: ['', Validators.required],
      curationEndDate: [null],
      resourceId : [null]
      // featureId:[''],
    })

    this.manageContentForm.get('curationStartDate').valueChanges
      .subscribe(date => {
        if (date) {
          this.setCurationDateConstraints(new Date(date));
        }
      });

    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.contentId = params.id;
        this.resolveUploadStepNavigation();
        this.rwsContentManagementService.getContentDetails(params.id).subscribe(data => {
          console.log(data)
          this.isNew = false;
          this.manageContentForm.patchValue(data);
           this.manageContentForm.get('resourceTypeId').setValue(data.rwsResourceType.resourceTypeId);
           this.manageContentForm.get('resourceId').setValue(data.rwsResourceType.id);

          if(data.curationStartDate) {
            this.manageContentForm.get('curationStartDate').setValue(new Date(data.curationStartDate));
          }
          if(data.curationEndDate) {
            this.manageContentForm.get('curationEndDate').setValue(new Date(data.curationEndDate));
          }
          this.manageContentForm.get('curationStartDate').disable();
          this.setCurationDateConstraints(new Date(data.curationStartDate));
        });
      } else {
        this.isNew = true;
      }
    });
  }

  formatPayload(payload) {
    const obj = {
      contentId: payload?.contentId,
      title: payload?.title,
      author: payload?.author,
      description: payload?.description,
      curationStartDate: payload?.curationStartDate,
      curationEndDate: payload?.curationEndDate,
      rwsResourceType: {
        id:payload.resourceId,
        resourceTypeId: payload?.resourceTypeId 
      },     

    }

    return obj;

  }




  resolveUploadStepNavigation() {
    const contentUploadURL: any = '/rws-content-management/upload';
    this.rwsContentManagementService.getContent(this.contentId).subscribe(data => {
      if (data.modules.length > 0) {
        const moduleId = data.modules[0].id;
         if(data.modules[0].type === "URL") {
          const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig2, 'id', 'U');
          uploadStep.state = contentUploadURL + '/external/view';
          uploadStep.queryParams = {moduleId: moduleId};
         } else {
          const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig2, 'id', 'U');
          uploadStep.state = contentUploadURL + '/internal';
         }
      } else {
        const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig2, 'id', 'U');
        uploadStep.state = contentUploadURL;
        uploadStep.queryParams = {moduleId: null};
      }
    });

  }

  getLearningStyleList() {
    this.rwsContentManagementService.getLearningStyleList().subscribe(
      learningStyleList => {
        this.learningStyleNameList = learningStyleList;
      });
  }
  onSubmit(data) {
    if (this.isNew) {
      this.createNewContent(data);
    } else {
      this.editContent(data)
    }
  }

  createNewContent(form: FormGroup) {
    this.data = this.formatPayload(form.getRawValue());

    this.data.curationStartDate = Utility.transformDateToString(this.data.curationStartDate);
    this.data.curationEndDate = Utility.transformDateToString(this.data.curationEndDate);
    this.rwsContentManagementService.postNewContent(this.data).subscribe(
      response => {
        this.router.navigate(['/rws-content-management/establishment'], { queryParams: { id: response.responseObject.contentId } });
        this.snackBarService.success(response.message.applicationMessage);
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  editContent(form: FormGroup) {
    this.data = this.formatPayload(form.getRawValue());
    this.data.curationStartDate = Utility.transformDateToString(this.data.curationStartDate);
    this.data.curationEndDate = Utility.transformDateToString(this.data.curationEndDate);
    this.rwsContentManagementService.updateContentDescription(this.data).subscribe(
      response => {
        this.router.navigate(['/rws-content-management/establishment'], { queryParams: { id: response.responseObject.contentId } });
        this.snackBarService.success(response.message.applicationMessage);
      },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      }
    )
  }

  setCurationDateConstraints(date?: Date) {
    if(this.isNew) {
      this.minEndDate = new Date(date);
      this.minEndDate.setDate(date.getDate() + 1);
    } else {
      this.minStartDate = new Date(date);
      this.minEndDate = new Date(this.minStartDate);
      this.minEndDate.setDate(date.getDate() + 1);
    }
  }

}
