import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpencsverrorpopupComponent } from './opencsverrorpopup.component';

describe('OpencsverrorpopupComponent', () => {
  let component: OpencsverrorpopupComponent;
  let fixture: ComponentFixture<OpencsverrorpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpencsverrorpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpencsverrorpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
