import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModulComponent } from './add-modul.component';

describe('AddModulComponent', () => {
  let component: AddModulComponent;
  let fixture: ComponentFixture<AddModulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
