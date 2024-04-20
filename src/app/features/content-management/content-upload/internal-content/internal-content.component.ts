import { Component, OnInit, ViewChild } from '@angular/core';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { AppConfirmService } from '../../../../framework/components/app-confirm/app-confirm.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentManagementSteps } from '../../content.steps';
import { StepperNavigationService } from '../../../shared/components/stepper-navigation/stepper-navigation.service';
import { MatTable } from '@angular/material/table';
import { IContentModule } from '../../content.interface';
import { ContentManagementService } from '../../content-management.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-internal-content',
  templateUrl: './internal-content.component.html',
  styleUrls: ['./internal-content.component.scss']
})
export class InternalContentComponent implements OnInit {

  contentId: number;
  displayedColumns: string[] = ['name', 'status', 'action'];
  dataSource: IContentModule[] = [];
  contentUploadURL: any = '/content-management/upload';

  @ViewChild('moduleTable', {static:false}) table: MatTable<IContentModule>;

  public page: number = 0;
  public size: number = 40;
  filterBy = { 'keyword': '' };
  exitButtonBehaviour: any;
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
        if(this.profileUrl == 'rws-participant'){
          this.router.navigate(['/content-management']);
        }else{
          this.router.navigate(['/rws-content-management']);
        } 
      }
      this.contentId = +params.id;
      this.resolveContentModules(this.page, this.size, this.filterBy);
    });
  }

  ngAfterViewInit() {
  }

  resolveContentModules(page: number, size: number, filterBy: { 'keyword': string; }) {
    this.contentService.getContentModules(this.contentId, page, size, filterBy)
      .subscribe((data: any) => {
        if(data.content.length > 0){
          this.dataSource = data.content;
          if(this.profileUrl == 'rws-participant'){
            this.exitButtonBehaviour = '/rws-content-management';
          }else{
            this.exitButtonBehaviour = '/content-management';
          }       
        } else {
          this.dataSource = null;
          if(this.profileUrl == 'rws-participant'){
            this.exitButtonBehaviour = '/rws-content-management/upload';
          }else{
            this.exitButtonBehaviour = '/content-management/upload';
          }  
         
        }
        
      });
  }

  refreshStatus(module: IContentModule) {
    this.contentService.refreshUploadStatus(module.id).subscribe(res => {
      module.statusName = res.statusName;
    });
  }

  showRefreshButton(status: string) {
    return status !== 'Completed' && status !== 'Upload Failed';
  }

  updateSequence(event: CdkDragDrop<IContentModule[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
    if (prevIndex !== event.currentIndex) {
      const sequenceIds = this.dataSource.map(item => item.id);
      this.contentService.updateSequence(this.contentId, sequenceIds).subscribe();
    }
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
              this.resolveContentModules(this.page, this.size, this.filterBy);
            },
            error => this.snackBarService.error(`${error.error.applicationMessage}`)
          );
      }
    });
  }
  
  canExit(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
    return (nextState.url.indexOf('/upload?') === -1 );
  }


}
