import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptrLearnersComponent } from './captr-learners.component';

describe('CaptrLearnersComponent', () => {
  let component: CaptrLearnersComponent;
  let fixture: ComponentFixture<CaptrLearnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptrLearnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptrLearnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
