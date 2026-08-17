import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResourceService } from '../../../core/services/resource.service';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryReadDto } from '../../../models/category.model';
import { extractErrorMessage } from '../../../core/utils/error-utils';

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
];

@Component({
  selector: 'app-admin-resource-new',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-resource-new.html',
  styleUrl: './admin-resource-new.scss',
})
export class AdminResourceNew implements OnInit{
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceService);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  submitting = signal(false);
  categories = signal<CategoryReadDto[]>([]);

  days = DAYS;

  resourceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: [''],
    isAvailable: [true],
    slotDurationMinutes: [30, [Validators.required, Validators.min(1)]],
    availableFrom: ['08:00', [Validators.required]],
    availableTo: ['17:00', [Validators.required]],
    allowedDays: this.fb.array(DAYS.map(() => false)),
    categoryId: [null as number | null],
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  onSubmit(): void {
    if (this.resourceForm.invalid) {
      this.resourceForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const raw = this.resourceForm.getRawValue();

    const allowedDays = DAYS
      .filter((_, index) => raw.allowedDays[index])
      .map(d => d.value);

    this.resourceService.create({
      name: raw.name!,
      description: raw.description || null,
      isAvailable: raw.isAvailable!,
      slotDurationMinutes: raw.slotDurationMinutes!,
      availableFrom: raw.availableFrom! + ':00',
      availableTo: raw.availableTo! + ':00',
      allowedDays,
      categoryId: raw.categoryId,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('Resource created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/admin/resources']);
      },
      error: (err) => {
        this.submitting.set(false);
        const message = extractErrorMessage(err, 'Failed to create resource.');
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/resources']);
  }
}
