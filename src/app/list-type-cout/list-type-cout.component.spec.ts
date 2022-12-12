import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeCoutComponent } from './list-type-cout.component';

describe('ListTypeCoutComponent', () => {
  let component: ListTypeCoutComponent;
  let fixture: ComponentFixture<ListTypeCoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTypeCoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTypeCoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
