import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { BaseUrl } from '../framework/constants/url-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IUserMessage } from './signin/signin.interface';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { SessionsService } from './sessions.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent {

  public logoSrc = `${BaseUrl.LOGO}`;
  signinForm: FormGroup;
  signinError: IUserMessage;

  constructor(
    private readonly builder: FormBuilder,
    private readonly router: Router,
    private readonly sessionsService: SessionsService
  ) { }

}
