import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeDeliveryComponent } from './programme-delivery.component';

describe('ProgrammeDeliveryComponent', () => {
  let component: ProgrammeDeliveryComponent;
  let fixture: ComponentFixture<ProgrammeDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
