import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ManageUsersService } from './../manage-users.service';
import { IUser } from './../user.interface';
import { SnackBarService } from './../../../framework/service/snack-bar.service';
import { IEstablishment, ILotname } from '../../shared/components/org-search-filter/org-search-filter.interface';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  loggedInUserRole: number;
  user: IUser
  roles = []
  organizations: any;
  userOrganizations: IEstablishment[] = [];
  constructor(
    private readonly manageUsersService: ManageUsersService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.loggedInUserRole = this.manageUsersService.resolveLoggedInUserRole();
    this.resolveRoles();
    this.resolveUser();
  }

  resolveRoles() {
    this.manageUsersService.getUserRoles().subscribe(roles => {
      this.roles = roles;
      this.roles.forEach((role) => {
        role.value = role.roleName;
        role.id = role.roleId;
      })
    })
  }

  resolveUser() {
    this.route.params.subscribe((params: any) => {
      const id = params.id;
      this.manageUsersService.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.resolveOrganizations(userDetails)
      }, error => {
        this.location.back();
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  resolveOrganizations(userDetails) {   
      
      this.organizations = userDetails.orgList.map((item: any) => ({
        id: item.id,
        isPrimary: false,
        organizationName: item.organizationName,
        lotName: item.lotName
      }));

   this.userOrganizations =  this.organizations;
  
  }

}
