/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InternalSalesComponent } from './internal-sales.component';

describe('InternalSalesComponent', () => {
  let component: InternalSalesComponent;
  let fixture: ComponentFixture<InternalSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
