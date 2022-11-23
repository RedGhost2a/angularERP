import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOuvrageComponent } from './detail-ouvrage.component';

describe('DetailOuvrageComponent', () => {
  let component: DetailOuvrageComponent;
  let fixture: ComponentFixture<DetailOuvrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailOuvrageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailOuvrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
