import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToWardsQualificanPopUpComponent } from './to-wards-qualifican-pop-up.component';

describe('ToWardsQualificanPopUpComponent', () => {
  let component: ToWardsQualificanPopUpComponent;
  let fixture: ComponentFixture<ToWardsQualificanPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToWardsQualificanPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToWardsQualificanPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
