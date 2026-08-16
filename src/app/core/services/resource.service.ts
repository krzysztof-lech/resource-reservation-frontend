import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResourceReadDto, ResourceCreateDto, ResourceUpdateDto } from '../../models/resource.model';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Resources`;

  getAll(query?: string): Observable<ResourceReadDto[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    return this.http.get<ResourceReadDto[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ResourceReadDto> {
    return this.http.get<ResourceReadDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: ResourceCreateDto): Observable<ResourceReadDto> {
    return this.http.post<ResourceReadDto>(this.baseUrl, dto);
  }

  update(id: string, dto: ResourceUpdateDto): Observable<ResourceReadDto> {
    return this.http.put<ResourceReadDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}