import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ResourceService } from '../../../core/services/resource.service';
import { ResourceReadDto } from '../../../models/resource.model';

@Component({
  selector: 'app-resource-list',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.scss',
})
export class ResourceList implements OnInit {
  private resourceService = inject(ResourceService);
  private router = inject(Router);

  resources = signal<ResourceReadDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
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

  viewDetails(id: string): void {
    this.router.navigate(['/resources', id]);
  }

  formatTime(time: string): string {
    return time.slice(0, 5);
  }
}