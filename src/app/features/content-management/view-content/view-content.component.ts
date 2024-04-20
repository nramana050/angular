import { IContentModule } from './../content.interface';
import { ContentManagementService } from './../content-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

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

  @ViewChild('moduleTable', {static:false}) table: MatTable<IContentModule>;

  public page = 0;
  public size = 20;
  filterBy = { 'keyword': '' };
  hideModule: Boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snack: MatSnackBar,
    private readonly contentManagementService: ContentManagementService,
  ) {
    this.setTitle();
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
    this.getLearningStyleList();
    this.resolveContentDetails();
  }

  resolveContentDetails() {
    const externalModuleType = "URL";
    this.contentManagementService.getContent(this.contentId).subscribe(data => {
      this.contents = data;
      this.dataSource = data.modules;
      this.contents.contentKeyWords = data.contentKeyWords ? data.contentKeyWords.split(',') : [];
      if ((this.contents.modules !== null) && (this.contents.modules.length > 0)) {
        this.selectedModule = this.contents.modules[0];
        this.hideModule = (this.selectedModule.type === externalModuleType) ? true : false;
      }
    });
  }

  launchModule(itemModule) {
    this.selectedModule = itemModule;
    this.isOpenContent = true;
  }

  getLearningStyleList() {
    this.contentManagementService.getLearningStyleList().subscribe(
      learningStyleList => {
        this.learningStyleNameList = learningStyleList;
      });
  }
  filterLearningStyleList(learningStyleIds) {
    return this.learningStyleNameList.filter(item => learningStyleIds.indexOf(item.id) > -1).map(a => a.description);
  }
 }
