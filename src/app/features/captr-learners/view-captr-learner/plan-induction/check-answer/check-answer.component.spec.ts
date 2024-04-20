import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAnswerComponent } from './check-answer.component';

describe('CheckAnswerComponent', () => {
  let component: CheckAnswerComponent;
  let fixture: ComponentFixture<CheckAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
