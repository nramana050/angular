import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddProviderComponent } from 'src/app/features/admin/provider-setup/add-provider/add-provider.component';
import { IProvider } from 'src/app/features/admin/provider-setup/provider-setup.interface';
import { ProviderSetupService } from 'src/app/features/admin/provider-setup/provider-setup.service';
import { ParticipantNavigation } from 'src/app/features/participant-v2/view-participant/participant-nav';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { JobReadinessService } from '../job-readiness.service';


@Component({
  selector: 'app-add-job-readiness',
  templateUrl: './add-job-readiness.component.html',
  styleUrls: ['./add-job-readiness.component.scss']
})
export class AddJobReadinessComponent implements OnInit {

  Notes: string = " ";
  providerNamePattern = RegexPattern.allCharPattern
  codePattern = RegexPattern.allCharPattern
  jobreadynessForm: FormGroup;
  provider: IProvider;
  isNew = true;
  selectedOption: string = 'option1';
  favoriteSeason: string;
  colours;
  suId;
  url;
  isReferralsEmpty = false;
  readiness: any;
  id: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly jobReadinessService: JobReadinessService,
    private readonly dailogRef: MatDialogRef<AddProviderComponent>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly participantNavigation: ParticipantNavigation,
  ) {
    this.getColours();
    this.url = this.route.snapshot['_routerState'].url.split("/", 2)[1];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.suId = params.id;
      if (this.id) {
          this.isNew = false;
          this.getExistingData(); 
      }
  });
    this.jobreadynessForm = this.fb.group({
      colourId: ['', Validators.required],
      notes: [null, Validators.maxLength(300)]
    });
   this.getExistingData();
  }

  getExistingData(){
    this.readiness=this.data;
    if (this.readiness) {     
      this.jobreadynessForm.patchValue(this.readiness);
      this.jobreadynessForm.get('notes').setValue(this.readiness.notes);
      this.jobreadynessForm.get('colourId').setValue(this.readiness.colour.id);
    }
  }
  getColours() {
    this.jobReadinessService.getColours().subscribe(data => {
      this.colours = data;   
    })
  }

  onRadioButtonClick(season: any): void {
    console.log('Selected Season ID:', season.id);
    console.log('Selected Season Object:', season);
    season.text = this.Notes;
    console.log(this.Notes);
  }

  dialogClose(): void {
    this.dailogRef.close();
  }

onSubmit(): void {
  if (this.readiness && this.readiness.id) {
      this.updateReadiness();
  } else {
      this.createReadiness(); 
  }
}

createReadiness() {
  const payload = this.jobreadynessForm.getRawValue();
  payload.serviceUserId = this.suId;

  this.jobReadinessService.createReadiness(payload).subscribe(
      (resp) => {
          this.snackBarService.success('Rating created successfully');
          this.dailogRef.close();
         
      },
      (error) => {
          this.snackBarService.error(error.error.applicationMessage);
          this.dailogRef.close();
      }
  );
}

updateReadiness() {
  const payload = this.jobreadynessForm.getRawValue();
  payload.id = this.readiness.id;
  payload.serviceUserId = this.readiness.serviceUserId;

  this.jobReadinessService.updateReadiness(payload).subscribe(
    (resp) => {
      this.snackBarService.success('Rating updated successfully');
      this.dailogRef.close();
    },
    (error) => {
      this.snackBarService.error(error.error.applicationMessage);
      this.dailogRef.close();
    }
  );
}

}

