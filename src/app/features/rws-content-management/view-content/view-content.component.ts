import { Component, OnInit, ViewChild } from '@angular/core';
import { IContentModule } from '../../content-management/content.interface';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentManagementService } from '../../content-management/content-management.service';
import { RwsContentManagementService } from '../rws-content-management.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.scss']
})
export class ViewContentComponent implements OnInit {

  contents: any = {};
  externalModuleData: any = {};
  contentId: number;
  selectedModule: any;
  title: string;
  isOpenContent: Boolean = false;
  displayedColumns: string[] = ['name', 'status', 'action'];
  dataSource: IContentModule[] = [];
  learningStyleNameList: any[];
  resourseTypeId;

  @ViewChild('moduleTable', {static:false}) table: MatTable<IContentModule>;

  public page = 0;
  public size = 20;
  filterBy = { 'keyword': '' };
  hideModule: Boolean;
  allRefdata
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snack: MatSnackBar,
    private readonly contentManagementService: ContentManagementService,
    private readonly rwsContentManagementService : RwsContentManagementService
  ) {
    this.setTitle();
    this.rwsContentManagementService.getRefData().subscribe( data => {
      this.allRefdata =data;     
     });
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.contentId = params.id;
        if (params.content) {
          this.title = params.content;
        }
        this.route.snapshot.data['title'] = `Resource Details`;
      }
    });

  }

  ngOnInit() {
    this.resolveContentDetails();
  }

  resolveContentDetails() {
    const externalModuleType = "URL";
 
    forkJoin(this.contentManagementService.getContent(this.contentId), this.rwsContentManagementService.getContentDetails(this.contentId)).subscribe(data => {
      this.contents = data[0];
      this.dataSource = data[0].modules;
      this.contents.contentKeyWords = data[0].contentKeyWords ? data[0].contentKeyWords.split(',') : [];
      if ((this.contents.modules !== null) && (this.contents.modules.length > 0)) {
        this.selectedModule = this.contents.modules[0];
        this.hideModule = (this.selectedModule.type === externalModuleType) ? true : false;
      }
       
       const list = this.allRefdata?.refDataMap?.Resource_Type.filter(choice => choice.id === data[1].rwsResourceType.resourceTypeId);
       const choiceList = list[0];
       this.resourseTypeId = choiceList?.description;
       

    });
  }

  launchModule(itemModule) {
    this.selectedModule = itemModule;
    this.isOpenContent = true;
  }




}
