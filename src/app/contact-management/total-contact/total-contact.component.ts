import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-total-contact',
  templateUrl: './total-contact.component.html',
  styleUrls: ['./total-contact.component.css']
})
export class TotalContactComponent implements OnInit {

  constructor( private router: Router,private location: Location ) { }

  redirectToaddContact(){
    this.router.navigate(['/add-contact']);
  }

  redirectToImportContact(){
    this.router.navigate(['/import-contact']);
  }


  redirectToContactDetails(){
    this.router.navigate(['/contact-details']);
  }

  search;
  private term: string = "";
  
  //Pagination
  p = 1;
  showData = {
    //rows Per Page
    rowsPerPage: 5
  };

 
   // Table aray
 
   userData : any = [{ fname: "Jayanti", lname:  "Borde" , email: "jayanti@gmail.com", date: "29-08-2020" },
   {fname: "Sagar" , lname:  "Kadam" , email: "sagar@gmail.com",date: "29-08-2020"},
   {fname: "Jayi" , lname:  "Singh" , email: "jayi@gmail.com", date: "29-08-2020"},
   {fname: "Nilesh" , lname:  "Hinge" , email: "nilesh@gmail.com", date: "29-08-2020" },
   {fname: "Vaishali" , lname:  "Gorhe" , email: "vaishali@gmail.com",date: "29-08-2020"},
   {fname: "Mayank" , lname:  "Gupta" , email: "mayank@gmail.com", date: "29-08-2020"}];
 

   
  ngOnInit(): void {
  }

}
