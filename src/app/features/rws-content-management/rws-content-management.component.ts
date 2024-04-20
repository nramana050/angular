import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Content } from '../content-management/content.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RwsContentManagementService } from './rws-content-management.service'
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-rws-content-management',
  templateUrl: './rws-content-management.component.html',
  styleUrls: ['./rws-content-management.component.scss']
})
export class RwsContentManagementComponent implements OnInit {

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
    private readonly rwsContentManagementService: RwsContentManagementService,
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
    this.rwsContentManagementService
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
    this.rwsContentManagementService.getDeleteReasonsRefData().subscribe(
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

        this.rwsContentManagementService.deleteContent({ deleteReasonId: result, contentId: elementId }).subscribe(
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
