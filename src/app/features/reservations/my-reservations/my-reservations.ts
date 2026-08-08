import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationService } from '../../../core/services/reservation.service';
import { IReservationReadDto } from '../../../models/reservation.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-reservations',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.scss',
})
export class MyReservations implements OnInit {
  private reservationService = inject(ReservationService);
  private snackBar = inject(MatSnackBar);

  reservations = signal<IReservationReadDto[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  cancellingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading.set(true);
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load your reservations.');
        this.loading.set(false);
      }
    });
  }

  canCancel(reservation: IReservationReadDto): boolean {
    return reservation.status !== 'Cancelled' && new Date(reservation.startTime) > new Date();
  }

  cancelReservation(id: string): void {
    this.cancellingId.set(id);
    this.reservationService.cancel(id).subscribe({
      next: () => {
        this.cancellingId.set(null);
        this.snackBar.open('Reservation cancelled.', 'Close', { duration: 3000 });
        this.loadReservations();
      },
      error: (err) => {
        this.cancellingId.set(null);
        const message = err?.error?.detail || err?.error || 'Failed to cancel reservation.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }
}