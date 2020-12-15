import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBdeComponent } from './single-bde.component';

describe('SingleBdeComponent', () => {
  let component: SingleBdeComponent;
  let fixture: ComponentFixture<SingleBdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBdeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleBdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
