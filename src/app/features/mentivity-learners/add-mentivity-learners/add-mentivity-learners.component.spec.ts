import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMentivityLearnersComponent } from './add-mentivity-learners.component';

describe('AddMentivityLearnersComponent', () => {
  let component: AddMentivityLearnersComponent;
  let fixture: ComponentFixture<AddMentivityLearnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMentivityLearnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMentivityLearnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
