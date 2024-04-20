import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGoalsTabComponent } from './my-goals-tab.component';

describe('MyGoalsTabComponent', () => {
  let component: MyGoalsTabComponent;
  let fixture: ComponentFixture<MyGoalsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyGoalsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGoalsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
