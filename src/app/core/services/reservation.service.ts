import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateReservationDto, IReservationReadDto } from '../../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Reservations`;

  getAll(userId?: string, status?: string, isPast?: boolean): Observable<IReservationReadDto[]> {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    if (status) params = params.set('status', status);
    if (isPast !== undefined) params = params.set('isPast', isPast);

    return this.http.get<IReservationReadDto[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<IReservationReadDto> {
    return this.http.get<IReservationReadDto>(`${this.baseUrl}/${id}`);
  }

  getMyReservations(status?: string, isPast?: boolean): Observable<IReservationReadDto[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (isPast !== undefined) params = params.set('isPast', isPast);

    return this.http.get<IReservationReadDto[]>(`${this.baseUrl}/user/my`, { params });
  }

  create(dto: CreateReservationDto): Observable<IReservationReadDto> {
    return this.http.post<IReservationReadDto>(this.baseUrl, dto);
  }

  cancel(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/cancel`, {});
  }
}