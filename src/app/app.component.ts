import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { AppInsightsService } from './framework/service/app-insights.service';
import { BaseUrl } from './framework/constants/url-constants';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RoutePartsService } from './framework/service/route-parts.service';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { SessionsService } from './sessions/sessions.service';
import { environment } from 'src/environments/environment';
import { url } from 'inspector';
// import{} from '../assets/Reed.png'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  appTitle = BaseUrl.APPTITLE;
  public spinkit = Spinkit;
  pageTitle = '';
  clientDetails;
  logo: string;

  constructor(
    public title: Title,
    private readonly appInsightsService: AppInsightsService,
    private readonly router: Router,
    private readonly routePartsService: RoutePartsService,
    private readonly activeRoute: ActivatedRoute,
    // private readonly sessionsService: SessionsService,
    private readonly renderer: Renderer2
  ){
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.clarityTest();
    //   }
    // });
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     // Call a function to update the body class based on the current route
    //     this.updateBodyClass(event.urlAfterRedirects);
    //   }
    // });
  }
  private updateBodyClass(url: string): void {
    const body = document.body;

    // Remove any existing classes related to routes
    // body.classList.remove('uw-class');

    // Add the class based on the current route
    // if (url.includes('myunity')) {
    //   body.classList.add('uw-class1');
    // }
  }
  ngOnInit() {
    // this.setInitialData();
    // this.changePageTitle();
    // this.onload();
    //   this.sessionsService.currentLogo.subscribe(logo => {    
    //     this.logo = logo +  localStorage.getItem('logoPath');
    // });
    // this.applyUserway();
  }

  @HostListener('keyup',['$event']) keyUpEvent(event: Event) {
    this.appInsightsService.logEvent(""+event.type);
  }
  @HostListener('click',['$event']) clickEvent(event: Event) {
    this.appInsightsService.logEvent(""+event.type);
  }
  @HostListener('dblclick',['$event']) doubleClick(event: Event) {
		this.appInsightsService.logEvent(""+event.type);
  }
  @HostListener('submit',['$event']) submit(event: Event) {
		this.appInsightsService.logEvent(""+event.type);
  }
  @HostListener('drag',['$event']) drag(event: Event) {
		this.appInsightsService.logEvent(""+event.type);
  }
  @HostListener('drop',['$event']) drop(event: Event) {
		this.appInsightsService.logEvent(""+event.type);
  }

  changePageTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((routeChange) => {
      const routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      this.appInsightsService.logPageView(window.location.hash.split('/')[1]);
      if (!routeParts.length) {
        return this.title.setTitle(this.appTitle);
      }

      routeParts.reverse();
      this.pageTitle = routeParts
        .map((part) => part.title)
        .reduce((partA, partI) => `${partI}`);
      this.pageTitle += ` | ${this.appTitle}`;
      this.title.setTitle(this.pageTitle);
    });
  }

  darkmode() {
    const element = document.body;
    element.classList.toggle('dark-mode');
    if( localStorage.getItem('darkmode') === 'true' ){
      localStorage.setItem('darkmode', 'false');
    }else{
      localStorage.setItem('darkmode', 'true');
    }
  }

  onload() {
    document.body.classList.toggle('dark-mode', localStorage.getItem('darkmode') === 'true');
  }
  
  
  // async setInitialData() {
  //     await this.sessionsService.getClientDetails().toPromise().then(data => {
  //       if(data.id) {
  //       localStorage.setItem('clientId', data.id);
  //       localStorage.setItem('logoPath', data.logoPath);
  //       localStorage.setItem('ApplicationID',data.appId);
  //       localStorage.setItem('suAppId',data.serviceUserAppId);
  //       if (localStorage.getItem('landingPage') === null) {
  //         localStorage.setItem('landingPage', data.landingPageUrl);
  //       }
  //       localStorage.setItem('primaryAppColour',data.primaryAppColour);
  //       localStorage.setItem('secondaryAppColour',data.secondaryAppColour);
  //       localStorage.setItem('moodleUrl',data.moodleUrl);
  //       localStorage.setItem('identifier', data.identifier);
  //       document.documentElement.style.setProperty('--primary-color', data.primaryAppColour);
  //       document.documentElement.style.setProperty('--secondary-color', data.secondaryAppColour);
        
  //       if(data.identifier =='RWH') {
  //         document.documentElement.style.setProperty('--loaderUrl', 'url(../assets/Reed.png)');
  //         document.documentElement.style.setProperty('--loaderFilter','none')
  //       }
        
  //     }
  //     });
  // }
  clarityTest(){
    var msClarityCode = '';
    msClarityCode = environment.microsoftClarityProjectId;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i + "?cross_domain=true";
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", msClarityCode);
  }

  applyUserway() {
    let url = window.location.href;
    if(url.includes('test-staff')){
      this.renderer.addClass(document.body, 'userway');
    }
  }

}
