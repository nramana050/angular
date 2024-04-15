import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unsubscribe-email',
  templateUrl: './unsubscribe-email.component.html',
  styleUrls: ['./unsubscribe-email.component.css']
})
export class UnsubscribeEmailComponent implements OnInit {
  descflag = false;
  invalidflg = false;
  reqflg = false;
  unsubscibeInfo: any = {
    bounceReason: "",
    value1: ""
  }
  value: string[];
  factCampaignSkey: string;
  customerClientId: string;
  constructor(private router: Router, private emailService: EmailManaementService) { }

  ngOnInit(): void {

    this.invalidflg = false;

    if (!window.location.href.includes("?") || !window.location.href.includes("$")) {
      this.invalidflg = true;
    }
    if (window.location.href.includes("?") && window.location.href.includes("$")) {
      this.value = (window.location.href).split("?");
      this.factCampaignSkey = this.value[1].split("$")[0];
      this.customerClientId = this.value[1].split("$")[1].split("=")[0];
    }
  }


  chkClick() {
    this.descflag = false;
    this.reqflg = false;
    if (this.unsubscibeInfo.value1 == "Other") {
      this.descflag = true;
      this.unsubscibeInfo.bounceReason = "";

    } else {
      this.descflag = false;
      this.unsubscibeInfo.bounceReason = this.unsubscibeInfo.value1;
    }
  }

  unsubscribeMail(unsubscribeMail: NgForm) {
    this.reqflg = false;
    if (this.unsubscibeInfo.bounceReason != null && this.unsubscibeInfo.bounceReason != "" && this.unsubscibeInfo.bounceReason != undefined) {

      let resp = this.emailService.getUnsubscribeCount(this.factCampaignSkey, this.customerClientId, this.unsubscibeInfo.bounceReason);
      resp.subscribe(data => {
        // Swal.fire("Unsubscribe sucessfully!");
        Swal.queue([{
          title: 'Thanks',
          confirmButtonText: 'OK',
          text:
            'You unsubscribe successfully.',
          showLoaderOnConfirm: true,
          preConfirm: () => {
            window.close();
          }
        }])

      });
    } else {
      this.reqflg = true;
    }
  }


}
