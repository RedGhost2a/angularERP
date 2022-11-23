import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOuvrageComponent } from './form-ouvrage.component';

describe('FormOuvrageComponent', () => {
  let component: FormOuvrageComponent;
  let fixture: ComponentFixture<FormOuvrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormOuvrageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOuvrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
