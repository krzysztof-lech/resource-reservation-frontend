import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryReadDto, CategoryCreateDto, CategoryUpdateDto } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Categories`;

  getAll(): Observable<CategoryReadDto[]> {
    return this.http.get<CategoryReadDto[]>(this.baseUrl);
  }

  create(dto: CategoryCreateDto): Observable<CategoryReadDto> {
    return this.http.post<CategoryReadDto>(this.baseUrl, dto);
  }

  update(id: number, dto: CategoryUpdateDto): Observable<CategoryReadDto> {
    return this.http.put<CategoryReadDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}