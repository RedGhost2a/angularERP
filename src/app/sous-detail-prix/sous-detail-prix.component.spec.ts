import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousDetailPrixComponent } from './sous-detail-prix.component';

describe('SousDetailPrixComponent', () => {
  let component: SousDetailPrixComponent;
  let fixture: ComponentFixture<SousDetailPrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousDetailPrixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousDetailPrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
