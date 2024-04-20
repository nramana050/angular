import { ImageUrl } from '../../../framework/constants/image--url-constant';
import { tap } from 'rxjs/internal/operators/tap';
import { FormControl, Validators } from '@angular/forms';
import { ContentManagementService } from './../content-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentManagementSteps } from '../content.steps';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';



@Component({
  selector: 'app-edit-content-image',
  templateUrl: './edit-content-image.component.html',
  styleUrls: ['./edit-content-image.component.scss']
})
export class EditContentImageComponent implements OnInit {

  contentImageList: any[];
  private contentId: number;
  public contentImageCtrl: FormControl = new FormControl(null, Validators.required);
  sortColumn = '';
  sortDirection = '';
  pageSize = 12;
  profileUrl;
  filterBy = { 'keyword': '', 'contentId': null };
  public activeElement = 1;
  clientIdentifier:any;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly contentManagementService: ContentManagementService,
    private readonly snackBarService: SnackBarService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

    if(this.profileUrl == 'rws-participant'){
      this.stepperNavigationService.stepper(this.contentSteps.stepsConfig2);
    }else{
      this.stepperNavigationService.stepper(this.contentSteps.stepsConfig);
    } 
    }

  ngOnInit() {
    this.fetchClientDetails();
    this.route.queryParams.subscribe(params => {
      if (!params.id) {      
          this.router.navigateByUrl('../');
      } else {
        this.contentId = +params.id;
        this.filterBy.contentId = this.contentId;
        this.resolveImages(this.pageSize, 0, this.filterBy);
        this.contentManagementService.getSelectedImage(this.contentId).subscribe(
          response => {
            this.activeElement = response.id;
            this.contentImageCtrl.setValue(response.id);
          }
        )
      }
    });
  }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
    this.paginator.page.pipe(
      tap(() => this.resolveImages(this.pageSize, this.paginator.pageIndex, this.filterBy))
    ).subscribe();
  }

  saveImage() {
    this.contentManagementService.addImageToContent(this.contentId, this.contentImageCtrl.value)
      .subscribe(
        response => {
          if(this.profileUrl == 'rws-participant'){
            this.router.navigate(['/rws-content-management/upload'], { queryParams: { id: this.contentId } });
          }else{
            this.router.navigate(['/content-management/upload'], { queryParams: { id: this.contentId } });
          } 
          this.snackBarService.success(response.applicationMessage);
        }, error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
        });
  }

  resolveImages(size, pageIndex, filterBy) {

    this.contentManagementService
      .getContentImageList(size, pageIndex, filterBy)
      .subscribe(data => {
        this.contentImageList = data.content;
        this.paginator.length = data.totalElements;
      }, error => this.snackBarService.error(error.error.applicationMessage));
  }

  getImagePath(imageName: string) {
    return `${ImageUrl.CONTENT_IMAGE}${this.clientIdentifier}/240_160/${imageName}`;
  }

  async fetchClientDetails(){
   await  this.contentManagementService.getClient().toPromise().then((data:any) => {
     this.clientIdentifier = data.identifier;
   })
  
  }

  selectImage(item: any) {
    this.contentImageCtrl.setValue(item.id);
    this.activeElement = item.id;
  }

  onFilter(filterValue: string) {
    this.filterBy.keyword = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveImages(this.pageSize, 0, this.filterBy);
  }
}

