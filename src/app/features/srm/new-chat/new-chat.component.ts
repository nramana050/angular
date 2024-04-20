import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { RouterLink, Router } from '@angular/router';
import { SrmService } from "../srm.service";
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ChatNotificationMatBadgeService } from '../../../home/topnav/chatnotification/chatnotification-matbadge.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})

export class NewChatComponent implements OnInit {
  disabled: boolean = false;
  inputLength = '#char';
  
  kwList;
  suList;
  conversationWith;
  conversationWithId;
  newChatForm: FormGroup;
  status;
  kwControl = new FormControl();
  suControl = new FormControl();
  kwFilteredOptions: Observable<any>;
  suFilteredOptions: Observable<any>;
  goToChatLink = "srm/go-to-chat";
  isKwDisabled: any;
  isSuDisabled: any;
  profileURL;

  constructor(private readonly fb: FormBuilder,
    private readonly appConfirmService: AppConfirmService,
    private readonly router: Router,
    private readonly chatNotificationMatBadgeService: ChatNotificationMatBadgeService,
    private readonly srmService: SrmService,
    private readonly snack: MatSnackBar,
    private readonly snackbar: SnackBarService,
    private readonly manageUsersService: ManageUsersService,
    ) {
      this.profileURL = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.initForm();
    this.isKwDisabled = false;
    this.isSuDisabled = false;
  }

  ngOnInit() {
    this.disableMethod();
    this.chatNotificationMatBadgeService.emitChatFocus(true);
    const search = {}
    this.srmService.getSuList('SU').subscribe(data => {
      data.forEach(users=>{
         Object.assign(users,{userFullName : users.fullName});
       });
      this.suList = data;
      this.suFilteredOptions = this.newChatForm.controls['suControl'].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.userFullName),
        map(name => name ? this._suFilter(name) : this.suList.slice())
      );
    });
    this.manageUsersService.getFilterUserList(1).subscribe(data=>{
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.kwList = data
      this.kwFilteredOptions = this.newChatForm.controls['kwControl'].valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.userFullName),
          map(name => name ? this._kwFilter(name) : this.kwList.slice() ,
          )
        );
    });
  }
  disableMethod() {
    this.newChatForm.controls['kwControl'].valueChanges.subscribe(value => {
      value ? this.newChatForm.controls['suControl'].disable({emitEvent: false}) : this.newChatForm.controls['suControl'].enable({emitEvent: false});
    });

    this.newChatForm.controls['suControl'].valueChanges.subscribe(value => {
      value ? this.newChatForm.controls['kwControl'].disable({emitEvent: false}) : this.newChatForm.controls['kwControl'].enable({emitEvent: false});
    });
  }

  initForm() {
    this.newChatForm = this.fb.group({
      kwControl: [''],
      suControl: [''],
      input: this.fb.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(400)])
    }, {
      validators: this.chatFormValidator
    });
  }

  onKWListValueChange(value: any) {
    this.conversationWithId = value.id;
    this.kwList.forEach(kw => {
      if (!value) {
        this.conversationWith = null;
        this.status = null;
      } else if (kw.id === value.id) {
        this.conversationWith = kw.userFullName;
        this.status = "KW";
      }
    });
  }

  onSUListValueChange(value: any) {
    this.conversationWithId = value.id;
    this.suList.forEach(su => {
      if (!value) {
        this.conversationWith = null;
        this.status = null;
      } else if (su.id === value.id) {
        this.conversationWith = su.userFullName
        this.status = "SU";
      }
    });
  }

  chatFormValidator(control: AbstractControl) {
    const fg = control as FormGroup;
    const kwValue = fg.get('kwControl').value;
    const suValue = fg.get('suControl').value;
    if (!(kwValue || suValue)) {
      return { invalidTo: true }
    }
    return null;
  }

  openCancelDialog(value: string) {
    if (value && value.length > 0) {
      const dialogRef = this.appConfirmService.confirm({
        title: `Exit Conversation`,
        message: `Are you sure you want to cancel?`,
        okButtonLabel: 'Yes',
        cancelButtonLabel: 'No'
      });

      dialogRef.subscribe(result => {
        if (result) {
          this.router.navigateByUrl(this.goToChatLink);
        }
      });
    } else {
      this.router.navigateByUrl(this.goToChatLink);
    }
  }
  onSubmit(message: string) {
    if (this.conversationWithId) {
      const messageJson = {
        messageText: message,
        messageToId: this.conversationWithId,
        conersationWith: this.status
      }

      this.srmService.creatMessage(messageJson).subscribe(date => {
        if (date) {
          this.snackbar.success('Successfully sent message');
          this.router.navigateByUrl(this.goToChatLink);
        }
      },
        error => {
          this.snack.open(`${error.error.applicationMessage}`, 'Dismiss', { duration: 6000 });
        });
    } else {
      this.snack.open('Please select staff or participant', 'Dismiss', { duration: 4000, panelClass: ['snackbar-error'] });
    }

  }
  private _kwFilter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.kwList.filter(option => option.userFullName.toLowerCase().includes(filterValue));
  }

  private _suFilter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.suList.filter(option => option.userFullName.toLowerCase().includes(filterValue));
  }

  displayFn(user): string | undefined {
    return user ? user.userFullName : undefined;
  }
  commonOnInputValueChange(value: any){
    this.conversationWith = null;
    this.status = null;
    this.conversationWithId = null;
  }
  ngOnDestroy(): void {
    this.chatNotificationMatBadgeService.emitChatFocus(false);
  }

}
