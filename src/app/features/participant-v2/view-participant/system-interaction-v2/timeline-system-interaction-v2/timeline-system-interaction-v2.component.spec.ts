import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSystemInteractionV2Component } from './timeline-system-interaction-v2.component';

describe('TimelineSystemInteractionV2Component', () => {
  let component: TimelineSystemInteractionV2Component;
  let fixture: ComponentFixture<TimelineSystemInteractionV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineSystemInteractionV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineSystemInteractionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
