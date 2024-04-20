import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentKeywordsComponent } from './content-keywords.component';

describe('ContentKeywordsComponent', () => {
  let component: ContentKeywordsComponent;
  let fixture: ComponentFixture<ContentKeywordsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentKeywordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
