import { AppConfirmService } from './../../../../framework/components/app-confirm/app-confirm.service';
import { IKeyword } from '../../../../features/content-management/content.interface';
import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Keywords } from './content-keywords.interface';
import { ContentKeywordsService } from './content-keywords.service';
import { MatTableDataSource } from '@angular/material/table';
import {  MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { AdministrationNavigation } from '../../administration.nav';



@Component({
  selector: 'app-content-keywords',
  templateUrl: './content-keywords.component.html',
  styleUrls: ['./content-keywords.component.scss']
})
export class ContentKeywordsComponent implements OnInit {
  dataSource = new MatTableDataSource<Keywords>();
  public keywordOptions: IKeyword[];
  public size: number = 5000;
  public page: number = 0;
  filterBy = { 'searchString': '', keywordType: 'Content' };
 
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;

  constructor(
    private readonly keywordService: ContentKeywordsService,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
    private readonly inPageNavService: InPageNavService,
    private readonly administrationNavigation: AdministrationNavigation
  ) { this.inPageNavService.setNavItems(this.administrationNavigation.administrationPageMenu);}

  ngOnInit() {
    this.fetchKeywordData(this.filterBy);
  }

  fetchKeywordData(filterBy) {
    this.keywordService
    .getAllKeywords( this.size, this.page,filterBy).subscribe(
      data => {
        this.keywordOptions = data.content;
       },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
        this.router.navigate(['./administration/content-keywords']);
      }
    );
  }

  onFilter(value) {
    this.filterBy.searchString = value;
    this.fetchKeywordData(this.filterBy);
  }

  removeKeyword(elementId: number): void {

    const dialogRef = this.appConfirmService.confirm({
      title: `Delete keyword`,
      message: `Are you sure you want to delete keyword, this may be linked to active resource?`,
      showTextField: false,
      placeholderTextField: ''
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.keywordService
          .deleteKeyword({ id: elementId }).subscribe(
            (response: any) => {
              this.snackBarService.success(response.applicationMessage);
              this.fetchKeywordData(this.filterBy);
            },
            error => this.snackBarService.error(`${error.error.applicationMessage}`)
          );
      }
    });

 
  }
  ngOnDestroy(): any {
    this.inPageNavService.setNavItems(null);
  }

}
