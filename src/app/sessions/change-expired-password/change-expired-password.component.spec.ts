import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeExpiredPasswordComponent } from './change-expired-password.component';

describe('ChangeExpiredPasswordComponent', () => {
  let component: ChangeExpiredPasswordComponent;
  let fixture: ComponentFixture<ChangeExpiredPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeExpiredPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeExpiredPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
