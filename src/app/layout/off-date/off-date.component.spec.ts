import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffDateComponent } from './off-date.component';

describe('OffDateComponent', () => {
  let component: OffDateComponent;
  let fixture: ComponentFixture<OffDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
