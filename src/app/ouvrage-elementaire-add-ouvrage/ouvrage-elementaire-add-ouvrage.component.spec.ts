import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuvrageElementaireAddOuvrageComponent } from './ouvrage-elementaire-add-ouvrage.component';

describe('OuvrageElementaireAddOuvrageComponent', () => {
  let component: OuvrageElementaireAddOuvrageComponent;
  let fixture: ComponentFixture<OuvrageElementaireAddOuvrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuvrageElementaireAddOuvrageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OuvrageElementaireAddOuvrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
