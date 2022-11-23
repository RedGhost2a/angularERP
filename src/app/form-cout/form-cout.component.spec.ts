import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCoutComponent } from './form-cout.component';

describe('FormCoutComponent', () => {
  let component: FormCoutComponent;
  let fixture: ComponentFixture<FormCoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
