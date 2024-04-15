import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  constructor( private router: Router,private location: Location) { }

  updateInfo: any = {
    firstName: "",
    lastName: "",
  };


  redirectToaddContact(){
    this.router.navigate(['/add-contact']);
  }

  redirectToImportContact(){
    this.router.navigate(['/import-contact']);
  }

  ngOnInit(): void {
  }

}
