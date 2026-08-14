import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResourceService } from '../../../core/services/resource.service';
import { ResourceReadDto } from '../../../models/resource.model';

@Component({
  selector: 'app-admin-resources',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-resources.html',
  styleUrl: './admin-resources.scss',
})
export class AdminResources implements OnInit {
  private resourceService = inject(ResourceService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  resources = signal<ResourceReadDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  displayedColumns = ['name', 'category', 'hours', 'available', 'actions'];

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading.set(true);
    this.resourceService.getAll().subscribe({
      next: (data) => {
        this.resources.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load resources.');
        this.loading.set(false);
      }
    });
  }

  formatTime(time: string): string {
    return time.slice(0, 5);
  }

  addNew(): void {
    this.router.navigate(['/admin/resources/new']);
  }

  edit(id: string): void {
    this.router.navigate(['/admin/resources', id, 'edit']);
  }

  delete(resource: ResourceReadDto): void {
    const confirmed = confirm(`Delete "${resource.name}"? This cannot be undone.`);
    if (!confirmed) return;

    this.resourceService.delete(resource.id).subscribe({
      next: () => {
        this.snackBar.open('Resource deleted.', 'Close', { duration: 3000 });
        this.loadResources();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.error || 'Failed to delete resource.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}
