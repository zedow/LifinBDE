import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdeFormComponent } from './bde-form.component';

describe('BdeFormComponent', () => {
  let component: BdeFormComponent;
  let fixture: ComponentFixture<BdeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BdeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BdeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
