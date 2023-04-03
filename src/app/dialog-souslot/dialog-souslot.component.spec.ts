import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSouslotComponent } from './dialog-souslot.component';

describe('DialogSouslotComponent', () => {
  let component: DialogSouslotComponent;
  let fixture: ComponentFixture<DialogSouslotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSouslotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSouslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
