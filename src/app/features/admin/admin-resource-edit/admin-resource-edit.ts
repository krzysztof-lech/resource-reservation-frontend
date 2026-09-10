import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ResourceImageDto } from '../../../models/resource.model';
import { extractErrorMessage } from '../../../core/utils/error-utils';
import { environment } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-admin-resource-edit',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './admin-resource-edit.html',
  styleUrl: './admin-resource-edit.scss',
})
export class AdminResourceEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceService);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  categories = signal<CategoryReadDto[]>([]);
  images = signal<ResourceImageDto[]>([]);
  uploadingImage = signal(false);
  resourceId = '';
  apiBaseUrl = environment.apiUrl.replace('/api', '');

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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/admin/resources']);
      return;
    }
    this.resourceId = id;

    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories.set(cats)
    });

    this.resourceService.getById(id).subscribe({
      next: (res) => {
        this.resourceForm.patchValue({
          name: res.name,
          description: res.description || '',
          isAvailable: res.isAvailable,
          slotDurationMinutes: res.slotDurationMinutes,
          availableFrom: res.availableFrom.slice(0, 5),
          availableTo: res.availableTo.slice(0, 5),
          categoryId: res.categoryId,
        });

        const allowedDaysArray = this.resourceForm.get('allowedDays') as any;
        DAYS.forEach((day, index) => {
          allowedDaysArray.at(index).setValue(res.allowedDays.includes(day.value));
        });

        this.images.set(res.images);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load resource.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.resourceForm.invalid) {
      this.resourceForm.markAllAsTouched();
      return;
    }

    const raw = this.resourceForm.getRawValue();

    const allowedDays = DAYS
      .filter((_, index) => raw.allowedDays[index])
      .map(d => d.value);

    if (raw.isAvailable && allowedDays.length === 0) {
      this.snackBar.open('Select at least one allowed day to mark this resource as available.', 'Close', { duration: 5000 });
      return;
    }

    this.submitting.set(true);

    this.resourceService.update(this.resourceId, {
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
        this.snackBar.open('Resource updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/admin/resources']);
      },
      error: (err) => {
        this.submitting.set(false);
        const message = extractErrorMessage(err, 'Failed to update resource.');
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/resources']);
  }

  imageUrl(image: ResourceImageDto): string {
    return `${this.apiBaseUrl}${image.url}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingImage.set(true);

    this.resourceService.uploadImage(this.resourceId, file).subscribe({
      next: (image) => {
        this.images.update(imgs => [...imgs, image]);
        this.uploadingImage.set(false);
        this.snackBar.open('Image uploaded successfully.', 'Close', { duration: 3000 });
        input.value = '';
      },
      error: (err) => {
        this.uploadingImage.set(false);
        const message = extractErrorMessage(err, 'Failed to upload image.');
        this.snackBar.open(message, 'Close', { duration: 5000 });
        input.value = '';
      }
    });
  }

  deleteImage(image: ResourceImageDto): void {
    const confirmed = confirm('Delete this image?');
    if (!confirmed) return;

    this.resourceService.deleteImage(this.resourceId, image.id).subscribe({
      next: () => {
        this.images.update(imgs => imgs.filter(i => i.id !== image.id));
        this.snackBar.open('Image deleted.', 'Close', { duration: 3000 });
      },
      error: (err) => {
        const message = extractErrorMessage(err, 'Failed to delete image.');
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}
