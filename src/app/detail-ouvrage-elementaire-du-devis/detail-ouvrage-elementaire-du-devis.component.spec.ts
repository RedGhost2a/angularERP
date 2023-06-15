import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOuvrageElementaireDuDevisComponent } from './detail-ouvrage-elementaire-du-devis.component';

describe('DetailOuvrageElementaireDuDevisComponent', () => {
  let component: DetailOuvrageElementaireDuDevisComponent;
  let fixture: ComponentFixture<DetailOuvrageElementaireDuDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailOuvrageElementaireDuDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailOuvrageElementaireDuDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
