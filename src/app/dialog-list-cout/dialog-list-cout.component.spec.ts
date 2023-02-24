import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListCoutComponent } from './dialog-list-cout.component';

describe('DialogListCoutComponent', () => {
  let component: DialogListCoutComponent;
  let fixture: ComponentFixture<DialogListCoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogListCoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogListCoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
