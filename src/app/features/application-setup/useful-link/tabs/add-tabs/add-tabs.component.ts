import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TabsService } from '../tabs.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';

@Component({
  selector: 'app-add-tabs',
  templateUrl: './add-tabs.component.html',
  styleUrls: ['./add-tabs.component.scss']
})
export class AddTabsComponent implements OnInit {

  tabsForm: FormGroup;
  isNew = true;
  tabNamePattern = /^([^-\s])?[&!\?a-zA-Z0-9-\s]+$/
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private readonly fb: FormBuilder,
    private readonly dailogRef: MatDialogRef<AddTabsComponent>,
    private readonly tabservice: TabsService,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.resolveTabs();
  }

  resolveTabs() {
    this.inItTabsForm();
    console.log("this.data", this.data);

    if (this.data.id) {
      this.isNew = false;
      this.tabservice.getTabsDetails(this.data.id).subscribe(res => {
        this.tabsForm.patchValue(res);
      })

    }
  }

  inItTabsForm() {
    this.tabsForm = this.fb.group({
      id: null,
      tabsName: [null, [Validators.required, Validators.pattern(this.tabNamePattern), Validators.maxLength(100)]]
    })

  }

  onSubmit() {
    this.isNew ? this.createTab() : this.editTab();
  }

  createTab() {
    let payload = this.tabsForm.getRawValue();
    this.tabservice.createTabs(payload).subscribe(resp => {
      this.dailogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    },
      error => {
        this.dailogRef.close();
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  editTab() {
    let payload = this.tabsForm.getRawValue();
    this.tabservice.updateTabs(payload).subscribe(resp => {
      this.dailogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    },
      error => {
        this.dailogRef.close();
        this.snackBarService.error(error.error.applicationMessage);
      })

  }

  dialogClose() {
    this.dailogRef.close();
  }

}
