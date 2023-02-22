import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormCoutComponent } from './dialog-form-cout.component';

describe('DialogFormCoutComponent', () => {
  let component: DialogFormCoutComponent;
  let fixture: ComponentFixture<DialogFormCoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFormCoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFormCoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
