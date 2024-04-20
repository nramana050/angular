import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { IDocViewerConfig } from '../../shared/components/doc-viewer/doc-viewer.config';
import { ModuleTypes } from '../../../framework/constants/types.constants';
import { BaseUrl } from '../../../framework/constants/url-constants';
import { AppInsightsService } from '../../../framework/service/app-insights.service';


const docConfig: IDocViewerConfig = {
  showDownloadButton: false,
  showPrintButton: false,
  showOpenFileButton: false,
  showBookmarkButton: false,
  showSidebarButton: false,
  showSecondaryToolbarButton: false,
  showPresentationModeButton: true,
}

@Component({
  selector: 'app-content-module',
  templateUrl: './content-module.component.html',
  styleUrls: ['./content-module.component.scss']
})
export class ContentModuleComponent implements OnInit, OnChanges {

  @Input() module: any;
  @Input() contentId: number;

  viewType: String;
  moduleType: string;
  config: IDocViewerConfig;
  option: any;
  idx: string;
  
  constructor(private readonly appInsightsService: AppInsightsService) { }

  ngOnInit() {
    this.appInsightsService.logEvent('Content Viewed', {contentId: this.contentId, moduleId: this.module.id})
    this.idx = 'player';
    this.resolveTypes();
  }

  ngOnChanges(changes: SimpleChanges) { }

  resolveTypes() {
    const type = ModuleTypes.find(elem => {
      return elem.types.includes(this.module.type);
    });
    if (!type) {
      return;
    }
    this.viewType = type.viewType;
    this.moduleType = this.module.type;
    this.setLauncher();
  }

  private setLauncher() {
    if (this.viewType === 'scorm') {
      this.moduleType = this.module.type.split(':')[1];
      return;
    }
    if (this.viewType === 'pdf') {
      this.config = docConfig;
      return;
    }
    if (this.viewType === 'video') {
      this.option = {
        preload: 'auto'
      };
      return;
    }
    if (this.viewType === 'audio') {
      this.option = {
        preload: 'auto'
      };
      return;
    }

  }

  download(moduleId: number): void {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/${this.contentId}/module/${moduleId}/download`;
    this.createAndSubmitForm(href);
  }

  createAndSubmitForm(url: string): void {
    const fd = document.createElement('form');
    fd.setAttribute('action', url);
    fd.setAttribute('method', 'POST');
    const inputElem = document.createElement('input');
    inputElem.setAttribute('name', 'access_token');
    inputElem.setAttribute('value', 'Bearer ' + localStorage.getItem('token'));
    fd.appendChild(inputElem);
    const holder = document.getElementById('form_holder');
    holder.appendChild(fd);
    fd.submit();
    holder.removeChild(fd);
  }

}
