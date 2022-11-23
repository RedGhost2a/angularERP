import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOuvrageComponent } from './list-ouvrage.component';

describe('ListOuvrageComponent', () => {
  let component: ListOuvrageComponent;
  let fixture: ComponentFixture<ListOuvrageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOuvrageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOuvrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
