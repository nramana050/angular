import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProgrammeDeliveryComponent } from './add-programme-delivery.component';

describe('AddProgrammeDeliveryComponent', () => {
  let component: AddProgrammeDeliveryComponent;
  let fixture: ComponentFixture<AddProgrammeDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProgrammeDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProgrammeDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
