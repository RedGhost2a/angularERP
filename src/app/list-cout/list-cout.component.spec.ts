import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoutComponent } from './list-cout.component';

describe('ListCoutComponent', () => {
  let component: ListCoutComponent;
  let fixture: ComponentFixture<ListCoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
