import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { IReservationReadDto } from '../../../models/reservation.model';

@Component({
  selector: 'app-admin-reservations',
  imports: [
    DatePipe,
    FormsModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './admin-reservations.html',
  styleUrl: './admin-reservations.scss',
})
export class AdminReservations implements OnInit {
  private reservationService = inject(ReservationService);
  private snackBar = inject(MatSnackBar);

  reservations = signal<IReservationReadDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  statusFilter = signal<string>('all');

  displayedColumns = ['resource', 'user', 'time', 'status', 'actions'];

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);
    this.reservationService.getAll().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load reservations.');
        this.loading.set(false);
      }
    });
  }

  get filteredReservations(): IReservationReadDto[] {
    const filter = this.statusFilter();
    if (filter === 'all') return this.reservations();
    return this.reservations().filter(r => r.status === filter);
  }

  canCancel(reservation: IReservationReadDto): boolean {
    return reservation.status !== 'Cancelled' && new Date(reservation.startTime) > new Date();
  }

  cancelReservation(id: string): void {
    const confirmed = confirm('Cancel this reservation?');
    if (!confirmed) return;

    this.reservationService.cancel(id).subscribe({
      next: () => {
        this.snackBar.open('Reservation cancelled.', 'Close', { duration: 3000 });
        this.loadReservations();
      },
      error: (err) => {
        const message = err?.error?.detail || err?.error || 'Failed to cancel reservation.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}