import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoToChatComponent } from './go-to-chat.component';

describe('GoToChatComponent', () => {
  let component: GoToChatComponent;
  let fixture: ComponentFixture<GoToChatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoToChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
