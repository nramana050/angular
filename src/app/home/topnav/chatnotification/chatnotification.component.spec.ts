import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatnotificationComponent } from './chatnotification.component';

describe('ChatnotificationComponent', () => {
  let component: ChatnotificationComponent;
  let fixture: ComponentFixture<ChatnotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
