import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOuvrageElementaireComponent } from './list-ouvrage-elementaire.component';

describe('ListOuvrageElementaireComponent', () => {
  let component: ListOuvrageElementaireComponent;
  let fixture: ComponentFixture<ListOuvrageElementaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOuvrageElementaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOuvrageElementaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
