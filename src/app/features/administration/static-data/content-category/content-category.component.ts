import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { CategoryDetails } from './content-category.interface';
import { ContentCategoryService } from './content-category.service';
import { MatTableDataSource } from '@angular/material/table';
import {  MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { AppConfirmService } from '../../../../framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { AdministrationNavigation } from '../../administration.nav';

const ELEMENT_DATA: CategoryDetails[] = [
  {categoryName: 'Education', menuLevel: 'Level 1', actions: 'Edit'},
  {categoryName: 'History', menuLevel: 'Level 2', actions: 'Edit'},
  {categoryName: 'Event', menuLevel: 'Level 1', actions: 'Edit'},
  {categoryName: 'Social', menuLevel: 'Level 1', actions: 'Delete'}
];

@Component({
  selector: 'app-content-category',
  templateUrl: './content-category.component.html',
  styleUrls: ['./content-category.component.scss']
})
export class ContentCategoryComponent implements OnInit {
  displayedColumns: string[] = ['categoryName', 'menuLevel', 'actions'];
  dataSource = new MatTableDataSource<CategoryDetails>();

  sortColumn = 'categoryName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' };

  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort , {static:false}) sort: MatSort;
  filterArray = [];

  constructor(
    private readonly categoryService: ContentCategoryService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
    private readonly AdministrationNavigation: AdministrationNavigation,
    private readonly inPageNavService: InPageNavService,
  ) { 
    this.inPageNavService.setNavItems(this.AdministrationNavigation.administrationPageMenu);
  }

  ngOnInit() {
    this.fetchCategoryData(this.filterBy);
    this.fetchFilterList(this.filterBy);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.fetchCategoryData(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.fetchCategoryData(this.filterBy);
          document.querySelector('#category').scrollIntoView();
        }
          )
      )
      .subscribe();
  }

  fetchCategoryData(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.categoryService
    .getAllCategories(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy).subscribe(
      data => {
        this.dataSource.data = data.content;
        this.paginator.length = data.totalElements;
      },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
        this.router.navigate(['./administration/content-category']);
      }
    );
  }

  fetchFilterList(filterBy) {
    this.categoryService.getFilterList().subscribe(
      data => {
        this.filterArray = data.menuLevels;
      },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      }
    );
  }

  onFilter(filterValue: string) {
    this.filterBy.keyword = filterValue;
    this.paginator.pageIndex = 0;
    this.fetchCategoryData(this.filterBy);
  }
  dropdownFilter(obj) {
    this.filterBy['levelId'] = obj.id;
    this.paginator.pageIndex = 0;
    this.fetchCategoryData(this.filterBy);
  }

  ngOnDestroy(): any {
    this.inPageNavService.setNavItems(null);
  }

}
