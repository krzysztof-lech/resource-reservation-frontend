import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResourceNew } from './admin-resource-new';

describe('AdminResourceNew', () => {
  let component: AdminResourceNew;
  let fixture: ComponentFixture<AdminResourceNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResourceNew],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminResourceNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
