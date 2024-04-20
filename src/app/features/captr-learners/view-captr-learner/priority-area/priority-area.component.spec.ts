import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityAreaComponent } from './priority-area.component';

describe('PriorityAreaComponent', () => {
  let component: PriorityAreaComponent;
  let fixture: ComponentFixture<PriorityAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
