import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuvrageAddCoutComponent } from './ouvrage-add-cout.component';

describe('OuvrageAddCoutComponent', () => {
  let component: OuvrageAddCoutComponent;
  let fixture: ComponentFixture<OuvrageAddCoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuvrageAddCoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OuvrageAddCoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
