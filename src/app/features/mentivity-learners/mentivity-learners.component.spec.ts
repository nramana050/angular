import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentivityLearnersComponent } from './mentivity-learners.component';

describe('MentivityLearnersComponent', () => {
  let component: MentivityLearnersComponent;
  let fixture: ComponentFixture<MentivityLearnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentivityLearnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentivityLearnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
