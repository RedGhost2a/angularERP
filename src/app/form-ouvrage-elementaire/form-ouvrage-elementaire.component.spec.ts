import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOuvrageElementaireComponent } from './form-ouvrage-elementaire.component';

describe('FormOuvrageElementaireComponent', () => {
  let component: FormOuvrageElementaireComponent;
  let fixture: ComponentFixture<FormOuvrageElementaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormOuvrageElementaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOuvrageElementaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
