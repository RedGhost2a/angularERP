import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDevisComponent } from './detail-devis.component';

describe('DetailDevisComponent', () => {
  let component: DetailDevisComponent;
  let fixture: ComponentFixture<DetailDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
