import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentivityFurtherInfoComponent } from './mentivity-further-info.component';

describe('MentivityFurtherInfoComponent', () => {
  let component: MentivityFurtherInfoComponent;
  let fixture: ComponentFixture<MentivityFurtherInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentivityFurtherInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentivityFurtherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
