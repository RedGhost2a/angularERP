import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypeCoutComponent } from './form-type-cout.component';

describe('FormTypeCoutComponent', () => {
  let component: FormTypeCoutComponent;
  let fixture: ComponentFixture<FormTypeCoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTypeCoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTypeCoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
