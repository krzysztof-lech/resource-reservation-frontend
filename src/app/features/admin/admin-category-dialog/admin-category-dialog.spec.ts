import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoryDialog } from './admin-category-dialog';

describe('AdminCategoryDialog', () => {
  let component: AdminCategoryDialog;
  let fixture: ComponentFixture<AdminCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoryDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
