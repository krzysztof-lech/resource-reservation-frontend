import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { UserReadDto } from '../../../models/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  users = signal<UserReadDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  displayedColumns = ['name', 'email', 'role', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load users.');
        this.loading.set(false);
      }
    });
  }

  edit(id: string): void {
    this.router.navigate(['/admin/users', id, 'edit']);
  }

  delete(user: UserReadDto): void {
    const confirmed = confirm(`Delete user "${user.email}"? This cannot be undone.`);
    if (!confirmed) return;

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.snackBar.open('User deleted.', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.error || 'Failed to delete user.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}