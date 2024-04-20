import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { TrackTabService } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { ParticipantNavigation } from '../../participant-nav';
import { MatDialog } from '@angular/material/dialog';
import { PrintCaseNotesV2Component } from '../print-case-notes-v2/print-case-notes-v2.component';

@Component({
  selector: 'app-case-note-list-v2',
  templateUrl: './case-note-list-v2.component.html',
  styleUrls: ['./case-note-list-v2.component.scss']
})
export class CaseNoteListV2Component implements OnInit {

  page: number = 0;
  pageSize: number = 10;
  sortDireAndColumn: any = 'dateExpressed,desc';
  totalItems: number = 0;
  jobId: string;
  userId: string;
  name: string;
  SU: string;
  id: number;
  authenticatedUserOrgId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId;
  displayedColumns: string[] = ['noteTimestamp', 'time', 'Worker','Type', 'Activity', 'noteText', 'actions'];
  dataSource = new MatTableDataSource();
  dataSource1 = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  filterByCase = { 'keyword': '', 'userId': '', 'genericId': null };
  contentImageList: any[];
  activityRefData: any;
  caseNoteActivity: any;
  select = "all Intervention";
  showFilteredList: boolean = false;
  allCaseNoteList: boolean = true;
  sortColumn = 'noteTimestamp';
  sortDirection = 'desc';
  dataSources: any = [];
  filteredId: number
  hours = [
    { value: 0, label: '00' }, { value: 1, label: '01' }, { value: 2, label: '02' }, { value: 3, label: '03' }, { value: 4, label: '04' }, { value: 5, label: '05' },
    { value: 6, label: '06' }, { value: 7, label: '07' }, { value: 8, label: '08' }, { value: 9, label: '09' }, { value: 10, label: '10' }, { value: 11, label: '11' },
    { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' }, { value: 15, label: '15' }, { value: 16, label: '16' }, { value: 17, label: '17' },
    { value: 18, label: '18' }, { value: 19, label: '19' }, { value: 20, label: '20' }, { value: 21, label: '21' }, { value: 22, label: '22' }, { value: 23, label: '23' },
  ];
  minutes = ['00', '15', '30', '45'];
  startTime: string;
  startHour: string;
  startMinute: string;
  profileUrl;
  caseNoteListCount: any = 0;
  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly snackBarService: SnackBarService,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly appConfirmService: AppConfirmService,
    private readonly sessionService: SessionsService,
    private readonly pageNav: InPageNavService,
    private readonly learnerNav: LearnerNavigation,
    private readonly dialog: MatDialog
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.pageNav.setNavItems(this.learnerNav.learnerSubMenu1);
    this.setTitle();
  }
  ngOnInit(): void {
    this.resolveActivityRefData()
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.SU = params.SU;
      this.userId = params.id;
    });
    this.filterByCase = { 'keyword': '', 'userId': this.userId, 'genericId': null };
    this.resolveUserCaseNotes(this.filterByCase);
  }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe((data) => {
      if (data.active === 'time') {
        this.sortColumn = 'noteTimestamp'
      } else {
        this.sortColumn = data.active;
      }
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      if (this.allCaseNoteList) {
        this.resolveUserCaseNotes(this.filterByCase);
      } else {
        this.resolveFilteredUserCaseNotes(this.filterByCase, this.filteredId)
      }
    });

    this.paginator.page
      .pipe(
        tap(() => {
          if (this.allCaseNoteList) {
            this.resolveUserCaseNotes(this.filterByCase);
          } else {
            this.resolveFilteredUserCaseNotes(this.filterByCase, this.filteredId)
          }
          document.querySelector('#case-notes').scrollIntoView();
        })
      )
      .subscribe();
  }
  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.name}`;
    });
  }
  


  onFilter(filterString: string) {
    this.showFilteredList = false;
    this.select = "all Intervention";
    this.filterByCase.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.filterByCase.genericId = null;
    this.resolveUserCaseNotes(this.filterByCase);
  }


  findIntervention(event) {
    this.filteredId = event.value;
    this.showFilteredList = true;
    if (event.value === 'all Intervention') {
      this.paginator.pageIndex = 0;
      this.filterByCase.genericId = null;
      this.paginator.pageIndex = 0;
      this.resolveUserCaseNotes(this.filterByCase);
    } else if (event.value === 0) {
      this.paginator.pageIndex = 0;
      this.resolveUserCaseNotes(this.filterByCase);
    } else if (event.value !== 'all Intervention') {
      this.paginator.pageIndex = 0;
      this.resolveFilteredUserCaseNotes(this.filterByCase, this.filteredId);
    }
  }

  resolveFilteredUserCaseNotes(filterByCase, id: any) {
    filterByCase.genericId = id;
    this.dataSources = [];
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }

    this.captrLearnersService.findAllCaseNotes(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterByCase)
      .subscribe(allData => {

        allData.content.forEach(element => {
          element.noteSenderName = element.noteSenderName.split(' ')[0];
        });
        this.dataSource = allData.content;
        this.paginator.length = allData.totalElements;
        this.dataSource.sort = this.sort;



      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  resolveUserCaseNotes(filterByCase: any) {
    this.allCaseNoteList = true;
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.captrLearnersService.findAllCaseNotes(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterByCase)
      .subscribe(allUsersData => {
        allUsersData.content.forEach(element => {
          element.noteSenderName = element.noteSenderName.split(' ')[0];
          element.noteTimestamp = Utility.transformDateToString(element.noteTimestamp);
          if(element.startTime !== null){
          const meetingTimeSplitArr = element.startTime.split(':');
          const hoursArrIndexOfAppointment = this.hours.findIndex(hour => hour.label === meetingTimeSplitArr[0])
          this.startHour = this.hours[hoursArrIndexOfAppointment].label;
          const minutesArrIndexOfAppointment = this.minutes.findIndex(minute => minute === meetingTimeSplitArr[1])
          this.startMinute = this.minutes[minutesArrIndexOfAppointment];
          element.startTime = (this.startHour + ':' + this.startMinute);
          }
        });
        this.dataSource = allUsersData.content;
        this.paginator.length = allUsersData.totalElements;
        this.dataSource.sort = this.sort;
        this.caseNoteListCount=allUsersData.totalElements;

      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

  resolveActivityRefData() {

    this.caseNoteActivity=Utility.filterMapByKey("Case_Note_Activity");  
  
  }
  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'], { queryParams: { id: this.userId, name: this.name, SU: this.SU }});
  }
  
  onPaginateChange(event) {
    document.querySelector('#case-notes').scrollIntoView();
  }

  viewCaseNote() {
    this.captrLearnersService.viewUserCaseNote(this.userId).subscribe(data => {
    })

  }

  onDeleteCaseNote(caseNoteId: any): void {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Case Note`,
      message: `Are you sure you want to delete this case note?`,
      showTextField: false,
      placeholderTextField: ''
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.captrLearnersService
          .deleteUserCaseNote(caseNoteId).subscribe(
            (response: any) => {
              this.snackBarService.success(response.message.applicationMessage);
              this.resolveUserCaseNotes(this.filterByCase);
            },
            error => this.snackBarService.error(`${error.error.applicationMessage}`)
          );
      }
    });
  }
  Authorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

  openDialog() {
    const dialogRef = this.dialog.open(PrintCaseNotesV2Component,{
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
