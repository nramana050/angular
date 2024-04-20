import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RiskAssessmentService } from '../risk-assessment.service';

@Component({
  selector: 'app-risk-assessment-history',
  templateUrl: './risk-assessment-history.component.html',
  styleUrls: ['./risk-assessment-history.component.scss']
})
export class RiskAssessmentHistoryComponent implements OnInit {

  _visible: boolean;
  suId: any;
  riskAssessmentHistoryData: any;
  newElement: any;
  newArray: any;
  newArray1=[];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private readonly renderer: Renderer2,
    private readonly route: ActivatedRoute,
    private readonly riskAssessmentService: RiskAssessmentService,
  ) { }

  ngOnInit(): void {
    this.getRiskAssessmentHistory()

  }

  getRiskAssessmentHistory() {
    this.riskAssessmentService.getRiskAssessmentHistory(this.data).subscribe(data => {
      this.riskAssessmentHistoryData = data;
      for (let i = 0; i < this.riskAssessmentHistoryData.length; i++) {
      const element = this.riskAssessmentHistoryData[i].riskAssessmentTypeId;
      this.newElement = element ;
      this.newArray = this.newElement.split(',');
      this.newArray1.push(this.newArray);
    }
    })
  }

  close() {
    this.hide();
  }

  hide(event?: Event) {
    this.visible = false;
    this.renderer.removeClass(document.body, 'modal-open');
  }

  get visible(): boolean {
    document.getElementById('myModalLabel').onkeydown = function (e) {
      if ((e.which === 9) && (e.shiftKey === true)) {
        e.preventDefault(); // so that focus doesn't move out.
        document.getElementById('last').focus();
      }
    }
    const lastElement = document.getElementById('last');
    if (lastElement) {
      lastElement.onkeydown = function (e) {
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault();
          document.getElementById('myModalLabel').focus();
        }
      }
    }
    return this._visible;
  }

  set visible(val: boolean) {
    this._visible = val;
    if (this._visible) {
      (function () {
        document.getElementById('myModalLabel').focus();
      })();
      this.renderer.addClass(document.body, 'modal-open');
      const a = document.getElementById('myModalLabel');
      setTimeout(function () { a.focus(); }, 10);
    }
  }
}
