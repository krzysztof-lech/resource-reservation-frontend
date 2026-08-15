import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryReadDto } from '../../../models/category.model';

@Component({
  selector: 'app-admin-category-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-category-dialog.html',
  styleUrl: './admin-category-dialog.scss',
})
export class AdminCategoryDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<AdminCategoryDialog>);
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  categories = signal<CategoryReadDto[]>([]);
  loading = signal(true);
  submitting = signal(false);
  editingId = signal<number | null>(null);

  nameControl = this.fb.control('', [Validators.required, Validators.minLength(2)]);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load categories.', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  startEdit(category: CategoryReadDto): void {
    this.editingId.set(category.id);
    this.nameControl.setValue(category.name);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.nameControl.setValue('');
  }

  save(): void {
    if (this.nameControl.invalid) {
      this.nameControl.markAsTouched();
      return;
    }

    this.submitting.set(true);
    const name = this.nameControl.value!;
    const editing = this.editingId();

    const request = editing
      ? this.categoryService.update(editing, { name })
      : this.categoryService.create({ name });

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        this.nameControl.reset('');
        this.editingId.set(null);
        this.loadCategories();
      },
      error: (err) => {
        this.submitting.set(false);
        const message = err?.error?.detail || err?.error || 'Failed to save category.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  delete(category: CategoryReadDto): void {
    const confirmed = confirm(`Delete category "${category.name}"?`);
    if (!confirmed) return;

    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.snackBar.open('Category deleted.', 'Close', { duration: 3000 });
        this.loadCategories();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.error || 'Failed to delete category.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}