import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditContentComponent } from './edit-content.component';

describe('EditContentComponent', () => {
  let component: EditContentComponent;
  let fixture: ComponentFixture<EditContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
