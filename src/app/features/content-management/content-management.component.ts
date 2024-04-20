import { AppConfirmService } from '../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../framework/service/snack-bar.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../framework/components/date-adapter/date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Content } from './content.interface';
import { ContentManagementService } from './content-management.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
]
  
})
export class ContentManagementComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['title', 'mainCategory', 'subCategory', 'createdDate', 'isActive','action'];
  dataSource = new MatTableDataSource<Content>();

  sortColumn = 'title';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = {'keyword': ''};
  deleteReasonsRefData: any;

  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;

  constructor(
    private readonly contentManagementService: ContentManagementService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService
  ) { }

  resolveContents(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.contentManagementService
      .getContents(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.paginator.length = data.totalElements;
      },  error => this.snackBarService.error(error.error.applicationMessage));
  }

  onEditClicked(id): void {
    this.router.navigate([`./content`], { relativeTo: this.route, queryParams : { id : id }});
  }

  onFilter(filterValue: string) {
    this.filterBy.keyword = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveContents(this.filterBy);
  }

  ngOnInit() {
    this.resolveContents(this.filterBy);
    this.resolveDeleteReasonsRefData();
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
     this.resolveContents(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveContents(this.filterBy);
          document.querySelector('#contents').scrollIntoView();
        }
          )
      )
      .subscribe();
  }

  resolveDeleteReasonsRefData() {
    this.contentManagementService.getDeleteReasonsRefData().subscribe(
      data => this.deleteReasonsRefData = data.map(option => {
        return {
          id: option.id,
          reason: option.description,
        }; 
      }),
      error => this.snackBarService.error(`${error.error.applicationMessage}`)
    );
  }

  onDeleteClicked(elementId) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Resource`,
      message: `Please select a reason for deleting this resource`,
      showTextField: false,
      placeholderTextField: '',
      showSelectField: true,
      placeholderSelectField: `Please Select`,
      optionsSelectField: this.deleteReasonsRefData
    });

    dialogRef.subscribe(result => {

      if (result) {

        this.contentManagementService.deleteContent({ deleteReasonId: result, contentId: elementId }).subscribe(
          (response: any) => {
              this.snackBarService.success(response.applicationMessage);
              this.resolveContents(this.filterBy);
              },
            error => this.snackBarService.error(`${error.error.applicationMessage}`)
          );
      }
    });
  }
}
