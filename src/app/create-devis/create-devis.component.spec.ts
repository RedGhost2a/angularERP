import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDevisComponent } from './create-devis.component';

describe('CreateDevisComponent', () => {
  let component: CreateDevisComponent;
  let fixture: ComponentFixture<CreateDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
