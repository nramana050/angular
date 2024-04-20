import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationSetupComponent } from './qualification-setup.component';

describe('QualificationSetupComponent', () => {
  let component: QualificationSetupComponent;
  let fixture: ComponentFixture<QualificationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualificationSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
