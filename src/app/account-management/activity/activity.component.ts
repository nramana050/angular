import { Component, OnInit } from '@angular/core';
import { AccountServicesService } from '../account-services/account-services.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  order: string = 'requestedDate';
  reverse: boolean = true;

  deleteReq = {
    delete: ""
  };

  formData = {
    startDate: "",
    endDate: ""
  };

  activityPlan: any = [];
  allactivityPlan: any = [];

  //Pagination
  p = 1;
  showData = {
    //rows Per Page
    rowsPerPage: 5
  };

  constructor(private accountServicesService: AccountServicesService, private orderPipe: OrderPipe) { }

  ngOnInit(): void {
    this.getActivity();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  getActivity() {
    this.activityPlan = [];
    let resp = this.accountServicesService.getActivity(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      for (let i in data) {
        this.activityPlan = data;
        // console.log(data);
        
      }
    });
  }

  onCancelRequest(value) {
    this.deleteReq.delete = "1";
    Swal.fire({
      title: 'Delete request',
      text: "Do you want to delete this request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let resp = this.accountServicesService.cancelRequest(value);
        resp.subscribe(data => {
          this.getActivity();
        });
        Swal.fire({
          title: 'Request submitted successfully',
        })
      }
    })

  }

}
