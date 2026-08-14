import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-user-edit',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-user-edit.html',
  styleUrl: './admin-user-edit.scss',
})
export class AdminUserEdit implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  userId = '';

  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['User', [Validators.required]],
    password: [''],
  });

   ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/admin/users']);
      return;
    }
    this.userId = id;

    this.userService.getById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role || 'User',
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load user.');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { firstName, lastName, email, role, password } = this.userForm.getRawValue();

    this.userService.update(this.userId, {
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      role: role as 'User' | 'Admin',
      ...(password ? { password } : {})
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('User updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        this.submitting.set(false);
        const message = err?.error?.detail || err?.error || 'Failed to update user.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
