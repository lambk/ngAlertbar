import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAlertbarComponent } from './ng-alertbar.component';

describe('NgAlertbarComponent', () => {
  let component: NgAlertbarComponent;
  let fixture: ComponentFixture<NgAlertbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgAlertbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgAlertbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
