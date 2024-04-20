import { Component, OnInit } from '@angular/core';
import { IUser } from '../user.interface';
import { ManageUserV2Service } from '../manage-user-v2.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Location } from '@angular/common';
import { IEstablishment } from '../../shared/components/org-search-filter/org-search-filter.interface';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  loggedInUserRole: number;
  user: IUser
  roles = []
  prisonDescription=[];
  organizations: any;
  userOrganizations: IEstablishment[] = [];

  constructor(
    private readonly manageUserV2Service :ManageUserV2Service,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.loggedInUserRole = this.manageUserV2Service.resolveLoggedInUserRole();
    this.resolveRoles();
    this.resolveUser();
  }

  resolveRoles() {
    this.manageUserV2Service.getUserRoles().subscribe(roles => {
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
      this.manageUserV2Service.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.user.prison.forEach(prisonid =>{
          
        })
       console.log()
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
