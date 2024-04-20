import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditContentKeywordsComponent } from './edit-content-keywords.component';

describe('EditContentKeywordsComponent', () => {
  let component: EditContentKeywordsComponent;
  let fixture: ComponentFixture<EditContentKeywordsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContentKeywordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContentKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
