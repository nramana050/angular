import { Component, OnInit, ElementRef, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { CaptrLearnersService } from '../captr-learners/captr-learners.services';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseloadOverviewService } from './caseload-overview.service';
import { utils } from 'protractor';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
]
@Component({
  selector: 'app-caseload-overview',
  templateUrl: './caseload-overview.component.html',
  styleUrls: ['./caseload-overview.component.scss']
})
export class CaseloadOverviewComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  personalise: Boolean = false;
  datasourceActiveCases;
  datasourceUpcomingTask;
  datasourceOutstandingTask;
  datasourceRecentlyViewed;
  sortColumnActiveCases = 'fullName';
  sortDirectionActiveCases = 'asc';
  pageSizeActiveCases = 10;
  pageSizeUpcomingRisk = 10;
  pageSizeOutstandingRisk = 10;
  pageSizeRecently = 10;
  displayedColumnsActiveCases: string[] = ['fullName'];
  displayedColumnsUpcomingTask: string[] = ['fullName', 'task', 'dueDate'];
  filterByActiveCases = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('suAppId') };;
  filterByUpcoming = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('suAppId') };;
  filterByOutstanding = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('suAppId') };;
  filterByRecently = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('suAppId') };;
  filteredListSizeActiveCases;
  filteredListSizeUpcoming;
  filteredListSizeOutstanding;
  filteredListSizeRecently;

  @ViewChild('paginatorActiveCases') paginatorActiveCases: MatPaginator;
  @ViewChild('paginatorUpcoming') paginatorUpcoming: MatPaginator;
  @ViewChild('paginatorOutstanding') paginatorOutstanding: MatPaginator;
  @ViewChild('paginatorRecently') paginatorRecently: MatPaginator;
  @ViewChildren('parent1, parent2, parent3, parent4, parent5') parentDivs!: QueryList<ElementRef>;
  items = [1, 2, 3];
  personaliseForm: FormGroup;
  dashboardData
  isHighlighted: boolean[] = []
  profileUrl;

  constructor(
    private readonly router: Router,
    private readonly caseloadOverviewService: CaseloadOverviewService,
    private readonly fb: FormBuilder,) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

    this.caseloadOverviewService.personalise().subscribe(resp => {
      this.dashboardData = resp
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.paginationData();
    }, 1000);

    this.resolveUserLists()
  }

  paginationData() {
    this.paginatorActiveCases.page
      .pipe(
        tap(() => {
          this.resolveActiveCases();
        }
        )
      )
      .subscribe();

    this.paginatorUpcoming.page
      .pipe(
        tap(() => {
          this.resolveUpcomingTask();
        }
        )
      )
      .subscribe();

    this.paginatorOutstanding.page
      .pipe(
        tap(() => {
          this.resolveOutstandingTask();
        }
        )
      )
      .subscribe();

    this.paginatorRecently.page
      .pipe(
        tap(() => {
          this.resolveRecentlyViewed();
        }
        )
      )
      .subscribe();
  }

  onChildClick(index: number, dataChoiceId: number) {
    let group: FormGroup = this.fb.group({
      id: null,
      dataChoiceMappingId: null,
      isEnable: [null]
    })
    // Toggle the 'highlight' class for the respective parent element

    this.isHighlighted[index] = !this.isHighlighted[index];
    group.get('dataChoiceMappingId').patchValue(dataChoiceId)
    group.get('isEnable').patchValue(!this.isHighlighted[index])
    this.caseloadOverviewService.personalisePinUnpin(group.value).subscribe(resp => {
    })
  }

  allowPersonalise() {
    this.personalise = !this.personalise;
    if (!this.personalise) {
      this.ngOnInit()
    }
    else {
      this.dashboardData.forEach((element, index) => {
        this.isHighlighted.push(false)
        if (!element.isEnable) {
          element.isEnable = true
          this.isHighlighted[index] = true
        }
      });
    }
  }

  isEnable(dataChoiceId) {
    return this.dashboardData?.find(data => data.dataChoiceMappingId === dataChoiceId)
  }

  resolveUserLists() {
    this.resolveActiveCases();
  }

  resolveActiveCases() {
    let currentPageIndexActiveCases = 0;
    if (!this.paginatorActiveCases) {
      currentPageIndexActiveCases = 0;
    } else {
      currentPageIndexActiveCases = this.paginatorActiveCases.pageIndex;
    }
    this.filterByActiveCases.keyword = ''

    this.caseloadOverviewService.getFilteredSUList(this.pageSizeActiveCases, currentPageIndexActiveCases, this.filterByActiveCases).subscribe(data => {
      data.content.forEach(element => {
        element.workerfirstname = element.workerName.split(' ')[0];
      });

      this.datasourceActiveCases = data.content;
      this.paginatorActiveCases.length = data?.totalElements;
      this.filteredListSizeActiveCases = data.totalElements;

      this.resolveRecentlyViewed();
      this.resolveUpcomingTask();
      this.resolveOutstandingTask();
    })
  }

  resolveRecentlyViewed() {
    let currentPageIndexRecently = 0;
    if (!this.paginatorRecently) {
      currentPageIndexRecently = 0;
    } else {
      currentPageIndexRecently = this.paginatorRecently.pageIndex;
    }
    this.filterByRecently.keyword = ''

    this.caseloadOverviewService.getUserRecentlyViewedList(this.pageSizeRecently, currentPageIndexRecently, this.filterByRecently).subscribe(data => {
      this.datasourceRecentlyViewed = data.content;
      this.paginatorRecently.length = data.totalElements;
      this.filteredListSizeRecently = data.totalElements;
    })
    /*  this.caseloadOverviewService.getUserRecentlyViewedList().subscribe(data => {
        this.datasourceRecentlyViewed = data;
      }); */
  }

  resolveUpcomingTask() {
    let currentPageIndexUp = 0;
    if (!this.paginatorUpcoming) {
      currentPageIndexUp = 0;
    } else {
      currentPageIndexUp = this.paginatorUpcoming.pageIndex;
    }
    this.filterByUpcoming.keyword = ''

    this.caseloadOverviewService.getUpcomingTask(this.pageSizeUpcomingRisk, currentPageIndexUp, this.filterByUpcoming).subscribe(data => {

      this.datasourceUpcomingTask = data.content;
      this.paginatorUpcoming.length = data.totalElements;
      this.filteredListSizeUpcoming = data.totalElements;

    })
  }

  resolveOutstandingTask() {
    let currentPageIndexOutstanding = 0;
    if (!this.paginatorOutstanding) {
      currentPageIndexOutstanding = 0;
    } else {
      currentPageIndexOutstanding = this.paginatorOutstanding.pageIndex;
    }
    this.filterByOutstanding.keyword = ''

    this.caseloadOverviewService.getOutstandingTask(this.pageSizeOutstandingRisk, currentPageIndexOutstanding, this.filterByOutstanding).subscribe(data => {

      this.datasourceOutstandingTask = data.content;
      this.paginatorOutstanding.length = data.totalElements;
      this.filteredListSizeOutstanding = data.totalElements;
    })
  }

  viewUser(data) {
    this.router.navigate([this.profileUrl + `/participant-professional-view`], { queryParams: { id: data.id, name: data.fullName, operation: 'view' } });
  }

  viewUserByUserId(data) {
    this.router.navigate([this.profileUrl + `/participant-professional-view`], { queryParams: { id: data.userId, name: data.fullName, operation: 'view' } });
  }

  viewRiskAssesmentByUserId(data) {
    this.router.navigate([this.profileUrl + Utility.getPathByIdentifier(this.profileUrl)], { queryParams: { id: data.userId, name: data.fullName, operation: 'view' } });
  }

  exportCsv(){
    this.caseloadOverviewService.exportCsv().subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Caseload.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
   }
}


