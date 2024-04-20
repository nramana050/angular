import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';

export interface IUser {
  createdById: number;
  createdByName: string;
  isDeleted: boolean;
  isViewed: boolean;
  modifiedById: number;
  noteId: number;
  noteSenderId: number;
}

@Component({
  selector: 'app-case-note',
  templateUrl: './case-note.component.html',
  styleUrls: ['./case-note.component.scss']
})
export class CaseNoteComponent implements OnInit {

  userId: string;
  name: string;
  // lname: string;
  SU: string = 'SU';
  caseNote : boolean;
  sortColumn = 'name';
  sortDirection = 'asc';
  pageSize = 10;
  dataSource = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  filterBy = { 'keyword': '' , 'refUserType':'SF' };
  

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.setTitle();
   }

  ngOnInit(): void {

  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.name}`;
    });
  }
  

  activityTabs(tabName: string) {
    this.router.navigate(['/service-user/case-note/case-note'],
      { queryParams: { id: this.userId, name: this.name, SU: this.SU }});
  }

}