import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSystemInteractionComponent } from './timeline-system-interaction.component';

describe('TimelineSystemInteractionComponent', () => {
  let component: TimelineSystemInteractionComponent;
  let fixture: ComponentFixture<TimelineSystemInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineSystemInteractionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineSystemInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
