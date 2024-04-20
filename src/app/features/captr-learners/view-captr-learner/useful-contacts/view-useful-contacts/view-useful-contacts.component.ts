import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUsefulContact } from '../usefulContact.interface';
import { CaptrLearnersService } from '../../../captr-learners.services';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Location } from '@angular/common';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';


@Component({
  selector: 'app-view-useful-contacts',
  templateUrl: './view-useful-contacts.component.html',
  styleUrls: ['./view-useful-contacts.component.scss']
})
export class ViewUsefulContactsComponent implements OnInit, OnDestroy {

  usefulContact: IUsefulContact;
  profileUrl;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);  }

  ngOnInit(): void {
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.resolveUser();
  }

  resolveUser() {
    this.route.params.subscribe((params: any) => {
      const id = params.id;
      this.captrLearnersService.getUsefulContactDetails(id).subscribe(userDetails => {
        console.log(userDetails)
        this.usefulContact = userDetails;
      }, error => {
        this.location.back();
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl +'/useful-contacts'], { queryParamsHandling: 'preserve' });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
