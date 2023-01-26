import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmSuppComponent } from './dialog-confirm-supp.component';

describe('DialogConfirmSuppComponent', () => {
  let component: DialogConfirmSuppComponent;
  let fixture: ComponentFixture<DialogConfirmSuppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmSuppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmSuppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
