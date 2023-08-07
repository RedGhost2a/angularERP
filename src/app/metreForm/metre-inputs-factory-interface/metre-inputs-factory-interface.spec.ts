import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetreInputsFactoryInterface } from './metre-inputs-factory-interface';

describe('MetreInputsStategyFactoryComponent', () => {
  let component: MetreInputsFactoryInterface;
  let fixture: ComponentFixture<MetreInputsFactoryInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetreInputsFactoryInterface ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetreInputsFactoryInterface);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
