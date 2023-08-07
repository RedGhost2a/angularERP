import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetreLenghtStrategy } from './metre-lenght-strategy';

describe('MetreLenghtStrategyComponent', () => {
  let component: MetreLenghtStrategy;
  let fixture: ComponentFixture<MetreLenghtStrategy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetreLenghtStrategy ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetreLenghtStrategy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
