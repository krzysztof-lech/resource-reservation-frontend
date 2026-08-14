import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResourceEdit } from './admin-resource-edit';

describe('AdminResourceEdit', () => {
  let component: AdminResourceEdit;
  let fixture: ComponentFixture<AdminResourceEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResourceEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminResourceEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
