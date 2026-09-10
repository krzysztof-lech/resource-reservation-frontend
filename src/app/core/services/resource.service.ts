import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResourceReadDto, ResourceCreateDto, ResourceUpdateDto, ResourceImageDto } from '../../models/resource.model';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Resources`;

  getAll(query?: string, categoryId?: number): Observable<ResourceReadDto[]> {
    let params = new HttpParams();
    if (query) {
      params = params.set('q', query);
    }
    if (categoryId !== undefined) {
      params = params.set('categoryId', categoryId);
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

  uploadImage(resourceId: string, file: File): Observable<ResourceImageDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ResourceImageDto>(`${this.baseUrl}/${resourceId}/images`, formData);
  }

  deleteImage(resourceId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${resourceId}/images/${imageId}`);
  }
}