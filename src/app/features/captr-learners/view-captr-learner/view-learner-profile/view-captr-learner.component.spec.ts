import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaptrLearnerComponent } from './view-captr-learner.component';

describe('ViewCaptrLearnerComponent', () => {
  let component: ViewCaptrLearnerComponent;
  let fixture: ComponentFixture<ViewCaptrLearnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCaptrLearnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCaptrLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
