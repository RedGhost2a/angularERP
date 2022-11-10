import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepriseEditComponent } from './entreprise-edit.component';

describe('EntrepriseEditComponent', () => {
  let component: EntrepriseEditComponent;
  let fixture: ComponentFixture<EntrepriseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrepriseEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrepriseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
