import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ResourceService } from '../../../core/services/resource.service';
import { ResourceReadDto } from '../../../models/resource.model';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-resource-list',
  imports: [
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
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

  searchOpen = signal(false);
  searchQuery = '';
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadResources();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.loadResources();
    });
  }

  loadResources(): void {
    this.loading.set(true);
    this.resourceService.getAll(this.searchQuery).subscribe({
      next: (data) => {
        this.resources.set(data.filter(r => r.isAvailable));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load resources.');
        this.loading.set(false);
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  toggleSearch(): void {
    this.searchOpen.update(open => !open);
    if (!this.searchOpen()) {
      this.searchQuery = '';
      this.loadResources();
    }
  }

  viewDetails(id: string): void {
    this.router.navigate(['/resources', id]);
  }

  formatTime(time: string): string {
    return time.slice(0, 5);
  }
}