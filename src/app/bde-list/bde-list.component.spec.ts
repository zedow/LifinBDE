import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdeListComponent } from './bde-list.component';

describe('BdeListComponent', () => {
  let component: BdeListComponent;
  let fixture: ComponentFixture<BdeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BdeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BdeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
