import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgrammeComponent } from './view-programme.component';

describe('ViewProgrammeComponent', () => {
  let component: ViewProgrammeComponent;
  let fixture: ComponentFixture<ViewProgrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProgrammeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
