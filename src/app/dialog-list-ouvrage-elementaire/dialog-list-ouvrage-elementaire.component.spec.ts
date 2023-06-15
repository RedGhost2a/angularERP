import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListOuvrageElementaireComponent } from './dialog-list-ouvrage-elementaire.component';

describe('DialogListOuvrageElementaireComponent', () => {
  let component: DialogListOuvrageElementaireComponent;
  let fixture: ComponentFixture<DialogListOuvrageElementaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogListOuvrageElementaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogListOuvrageElementaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
