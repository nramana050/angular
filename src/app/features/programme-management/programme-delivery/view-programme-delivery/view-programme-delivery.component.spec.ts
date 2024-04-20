import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgrammeDeliveryComponent } from './view-programme-delivery.component';

describe('ViewProgrammeDeliveryComponent', () => {
  let component: ViewProgrammeDeliveryComponent;
  let fixture: ComponentFixture<ViewProgrammeDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProgrammeDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProgrammeDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
