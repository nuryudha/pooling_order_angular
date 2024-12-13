import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolingOrderComponent } from './pooling-order.component';

describe('PoolingOrderComponent', () => {
  let component: PoolingOrderComponent;
  let fixture: ComponentFixture<PoolingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolingOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
