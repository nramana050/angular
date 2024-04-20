import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditContentImageComponent } from './edit-content-image.component';

describe('EditContentImageComponent', () => {
  let component: EditContentImageComponent;
  let fixture: ComponentFixture<EditContentImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContentImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContentImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
