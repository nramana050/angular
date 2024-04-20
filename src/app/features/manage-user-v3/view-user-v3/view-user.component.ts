import { Component, OnInit } from '@angular/core';
import { IUser } from '../user.interface';
import { ManageUserV3Service } from '../manage-user-v3.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {

  loggedInUserRole: number;
  user: IUser
  roles = []

  constructor(
    private readonly manageUserV3Service: ManageUserV3Service,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.loggedInUserRole = this.manageUserV3Service.resolveLoggedInUserRole();
    this.resolveRoles();
    this.resolveUser();
  }

  resolveRoles() {
    this.manageUserV3Service.getUserRoles().subscribe(roles => {
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
      this.manageUserV3Service.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
      }, error => {
        this.location.back();
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }


}
