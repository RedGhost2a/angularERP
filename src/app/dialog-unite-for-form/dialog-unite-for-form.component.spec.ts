import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUniteForFormComponent } from './dialog-unite-for-form.component';

describe('DialogUniteForFormComponent', () => {
  let component: DialogUniteForFormComponent;
  let fixture: ComponentFixture<DialogUniteForFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUniteForFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUniteForFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
