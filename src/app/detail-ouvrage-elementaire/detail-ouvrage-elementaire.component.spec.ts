import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOuvrageElementaireComponent } from './detail-ouvrage-elementaire.component';

describe('DetailOuvrageElementaireComponent', () => {
  let component: DetailOuvrageElementaireComponent;
  let fixture: ComponentFixture<DetailOuvrageElementaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailOuvrageElementaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailOuvrageElementaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
