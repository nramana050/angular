import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationPopUpComponent } from './qualification-pop-up.component';

describe('QualificationPopUpComponent', () => {
  let component: QualificationPopUpComponent;
  let fixture: ComponentFixture<QualificationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualificationPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
