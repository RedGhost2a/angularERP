import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuvrageElementaireAddCoutComponent } from './ouvrage-elementaire-add-cout.component';

describe('OuvrageElementaireAddCoutComponent', () => {
  let component: OuvrageElementaireAddCoutComponent;
  let fixture: ComponentFixture<OuvrageElementaireAddCoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuvrageElementaireAddCoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OuvrageElementaireAddCoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
