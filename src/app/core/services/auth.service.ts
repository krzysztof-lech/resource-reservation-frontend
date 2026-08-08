import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginDto, TokenDto } from '../../models/auth.model';
import { UserRole } from '../../models/user.model';

const TOKEN_KEY = 'auth_token';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

interface DecodedToken {
  sub: string;
  email: string;
  [ROLE_CLAIM]: UserRole;
  jti: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  isAuthenticated = computed(() => !!this.tokenSignal() && !this.isTokenExpired());
  userRole = computed<UserRole | null>(() => this.decodeToken()?.[ROLE_CLAIM] ?? null);
  userId = computed<string | null>(() => this.decodeToken()?.sub ?? null);
  userEmail = computed<string | null>(() => this.decodeToken()?.email ?? null);
  isAdmin = computed(() => this.userRole() === 'Admin');

  constructor(private http: HttpClient) {}

  login(dto: LoginDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(`${environment.apiUrl}/Auth/login`, dto).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  private decodeToken(): DecodedToken | null {
    const token = this.tokenSignal();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  private isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return true;
    return decoded.exp * 1000 < Date.now();
  }
}