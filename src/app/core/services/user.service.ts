import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserReadDto, UserCreateDto, UserUpdateDto } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Users`;

  getAll(): Observable<UserReadDto[]> {
    return this.http.get<UserReadDto[]>(this.baseUrl);
  }

  getById(id: string): Observable<UserReadDto> {
    return this.http.get<UserReadDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: UserCreateDto): Observable<UserReadDto> {
    return this.http.post<UserReadDto>(this.baseUrl, dto);
  }

  update(id: string, dto: UserUpdateDto): Observable<UserReadDto> {
    return this.http.put<UserReadDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}