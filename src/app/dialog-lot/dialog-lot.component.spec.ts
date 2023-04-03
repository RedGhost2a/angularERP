import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLotComponent } from './dialog-lot.component';

describe('DialogLotComponent', () => {
  let component: DialogLotComponent;
  let fixture: ComponentFixture<DialogLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
