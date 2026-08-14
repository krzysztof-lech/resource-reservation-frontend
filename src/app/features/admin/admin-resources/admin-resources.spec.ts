import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResources } from './admin-resources';

describe('AdminResources', () => {
  let component: AdminResources;
  let fixture: ComponentFixture<AdminResources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResources],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminResources);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
