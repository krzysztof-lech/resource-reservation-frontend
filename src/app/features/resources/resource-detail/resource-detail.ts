import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResourceService } from '../../../core/services/resource.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ResourceReadDto } from '../../../models/resource.model';
import { IReservationReadDto } from '../../../models/reservation.model';
import { AuthService } from '../../../core/services/auth.service';

interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-resource-detail',
  imports: [
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './resource-detail.html',
  styleUrl: './resource-detail.scss',
})
export class ResourceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private resourceService = inject(ResourceService);
  private reservationService = inject(ReservationService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  resource = signal<ResourceReadDto | null>(null);
  allReservations = signal<IReservationReadDto[]>([]);
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  selectedDate = signal<Date>(new Date());
  minDate = new Date();
  selectedSlot = signal<TimeSlot | null>(null);

  resourceId = '';

  slots = computed<TimeSlot[]>(() => {
    const res = this.resource();
    const date = this.selectedDate();
    if (!res) return [];

    const dayOfWeek = date.getDay();
    if (!res.allowedDays.includes(dayOfWeek)) return [];

    const [fromH, fromM] = res.availableFrom.split(':').map(Number);
    const [toH, toM] = res.availableTo.split(':').map(Number);

    const dayStart = new Date(date);
    dayStart.setHours(fromH, fromM, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(toH, toM, 0, 0);

    const reservations = this.allReservations().filter(r =>
      r.resourceId === this.resourceId &&
      r.status !== 'Cancelled' &&
      this.isSameDay(new Date(r.startTime), date)
    );

    const result: TimeSlot[] = [];
    let cursor = new Date(dayStart);

    while (cursor < dayEnd) {
      const slotEnd = new Date(cursor.getTime() + res.slotDurationMinutes * 60000);
      if (slotEnd > dayEnd) break;

      const overlaps = reservations.some(r => {
        const rStart = new Date(r.startTime);
        const rEnd = new Date(r.endTime);
        return cursor < rEnd && slotEnd > rStart;
      });

      const isPast = slotEnd <= new Date();

      result.push({
        start: new Date(cursor),
        end: new Date(slotEnd),
        label: `${this.formatTime(cursor)} - ${this.formatTime(slotEnd)}`,
        isAvailable: !overlaps && !isPast
      });

      cursor = slotEnd;
    }

    return result;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/resources']);
      return;
    }
    this.resourceId = id;

    const dateParam = this.route.snapshot.queryParamMap.get('date');
    const startParam = this.route.snapshot.queryParamMap.get('start');
    const endParam = this.route.snapshot.queryParamMap.get('end');

    if (dateParam) {
      this.selectedDate.set(new Date(dateParam));
    }

    this.resourceService.getById(id).subscribe({
      next: (data) => {
        this.resource.set(data);
        this.loadReservations();

        if (startParam && endParam) {
          setTimeout(() => {
            const matchingSlot = this.slots().find(
              s => this.toLocalIso(s.start) === startParam && this.toLocalIso(s.end) === endParam
            );
            if (matchingSlot?.isAvailable) {
              this.selectedSlot.set(matchingSlot);
            }
          });
        }
      },
      error: () => {
        this.errorMessage.set('Failed to load resource.');
        this.loading.set(false);
      }
    });
  }

  loadReservations(): void {
    this.reservationService.getAll().subscribe({
      next: (data) => {
        this.allReservations.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load availability.');
        this.loading.set(false);
      }
    });
  }

  onDateChange(date: Date | null): void {
    if (date) {
      this.selectedDate.set(date);
      this.selectedSlot.set(null);
    }
  }

  selectSlot(slot: TimeSlot): void {
    if (!slot.isAvailable) return;
    this.selectedSlot.set(slot);
  }

  confirmReservation(): void {
    const slot = this.selectedSlot();
    const res = this.resource();
    if (!slot || !res) return;

    if (!this.authService.isAuthenticated()) {
      const returnUrl = `/resources/${res.id}?date=${this.toLocalIso(slot.start).slice(0, 10)}&start=${this.toLocalIso(slot.start)}&end=${this.toLocalIso(slot.end)}`;
      this.router.navigate(['/login'], {
        queryParams: { returnUrl }
      });
      return;
    }

    this.submitting.set(true);

    this.reservationService.create({
      resourceId: res.id,
      startTime: this.toLocalIso(slot.start),
      endTime: this.toLocalIso(slot.end)
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('Reservation created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/reservations/my']);
      },
      error: (err) => {
        this.submitting.set(false);
        const message = err?.error?.detail || err?.error || 'Failed to create reservation.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
      }
    });
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  private toLocalIso(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
}