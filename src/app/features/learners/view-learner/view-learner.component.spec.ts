import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLearnerComponent } from './view-learner.component';

describe('ViewLearnerComponent', () => {
  let component: ViewLearnerComponent;
  let fixture: ComponentFixture<ViewLearnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLearnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
