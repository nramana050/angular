import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ApplicationSetupNavigation } from '../../../application-setup-nav';
import { ApplicationSetupService } from '../../../application-setup.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-add-links',
  templateUrl: './add-links.component.html',
  styleUrls: ['./add-links.component.scss']
})
export class AddLinksComponent implements OnInit {
  linkNamePattern = RegexPattern.allCharPattern
  linkForm: FormGroup
  isNew = true;
  disableSaveButton: Boolean = false;
  tabs: any = [];
  isLoaded = false;
  profileUrl

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly inPageNavService: InPageNavService,
    private readonly appSetupNavigation: ApplicationSetupNavigation,
    private readonly snackBarService: SnackBarService,
    private readonly applicationSetupService: ApplicationSetupService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

      if(this.profileUrl == 'rws-participant'){
        this.inPageNavService.setNavItems(this.appSetupNavigation.appSetupSubMenu2)
      }else{
        this.inPageNavService.setNavItems(this.appSetupNavigation.appSetupSubMenu)
      }  
          this.resolveRefData();
  }

  ngOnInit(): void {
    this.applicationSetupService.getAllTabs().subscribe(resp => {

    },
      error => {

      })
    this.initForm();
  }
  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  initForm() {
    this.linkForm = this.fb.group({
      id: [null],
      linkName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), Validators.pattern(this.linkNamePattern)]],
      websiteURL: ['', [Validators.required, Validators.pattern('^(https?://)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)/?|(https?://)([\da-z.-]+)\.([a-z.]{2,6})(/.*)$')]],
      tab: [null, [Validators.required]],
    });

    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.isNew = false;
        this.applicationSetupService.getLink(params.id).subscribe(resp => {
          this.linkForm.patchValue(resp)
        })
      }

    })
  }

  createLink() {
    const payload = this.linkForm.getRawValue();
    this.applicationSetupService.createLink(payload).subscribe(resp => {
      this.router.navigate(["application-setup/links"]);
      this.snackBarService.success(resp.message.applicationMessage);
    },
      error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLink() {
    const payload = this.linkForm.getRawValue();
    this.applicationSetupService.updateLink(payload).subscribe(resp => {
      this.router.navigate(["application-setup/links"]);
      this.snackBarService.success(resp.message.applicationMessage);
    },
      error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  onSubmit() {
    this.isNew ? this.createLink() : this.updateLink();
  }

  resolveRefData() {
    forkJoin([
      this.applicationSetupService.getAllTabs(),
    ]).subscribe(data => {
      this.tabs = data[0];
      this.isLoaded = true;
    })
  }
}
