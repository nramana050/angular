import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditContentEstablishmentComponent } from './edit-content-establishment.component';

describe('EditContentEstablishmentComponent', () => {
  let component: EditContentEstablishmentComponent;
  let fixture: ComponentFixture<EditContentEstablishmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContentEstablishmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContentEstablishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
