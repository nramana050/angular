import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRwsContentEstablishmentComponent } from './edit-rws-content-establishment.component';

describe('EditRwsContentEstablishmentComponent', () => {
  let component: EditRwsContentEstablishmentComponent;
  let fixture: ComponentFixture<EditRwsContentEstablishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRwsContentEstablishmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRwsContentEstablishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
