import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { NgForm, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthServicesService } from '../auth-services/auth-services.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  // variable
  show_button: Boolean = false;
  show_button1: Boolean = false;
  show_eye: Boolean = false;
  show_eye1: Boolean = false;
  show_button2: Boolean = false;
  show_eye2: Boolean = false;

  editFlg = 0;

  showOldPassword() {
    this.show_button2 = !this.show_button2;
    this.show_eye2 = !this.show_eye2;
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  showPassword1() {
    this.show_button1 = !this.show_button1;
    this.show_eye1 = !this.show_eye1;
  }
  emailId: any;
  changePass = {
    currentPassword: '',
    newPassword: "",
    password1: "",
    email: ""
  };

  submitted = false;

  onSubmit() { this.submitted = true; }

  constructor(private router: Router, private location: Location, private authServicesService: AuthServicesService) { }

  ngOnInit(): void {
  }

  saveUser(createUserForm: NgForm) {
    this.emailId = sessionStorage.getItem("email");
    this.changePass.email = this.emailId;
    let resp = this.authServicesService.changePassword(this.changePass);
    resp.subscribe((data) => {
      if (data != 0) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Password reset successfully',
          showConfirmButton: false,
          timer: 4500
        })
        this.router.navigate(['/profile-edit']);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Please confirm current password and try again...',
          showConfirmButton: false,
          timer: 4500
        })

      }
    });
  }

}
