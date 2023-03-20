import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImportExcelComponent } from './dialog-import-excel.component';

describe('DialogImportExcelComponent', () => {
  let component: DialogImportExcelComponent;
  let fixture: ComponentFixture<DialogImportExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogImportExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogImportExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
