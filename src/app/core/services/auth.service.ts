import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../../models';
import { StorageService } from './storage.service';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  private readonly _currentUser = signal<User | null>(this.storage.get<User>(USER_KEY));
  private readonly _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isLoading = this._isLoading.asReadonly();

  get accessToken(): string | null {
    return this.storage.get<string>(TOKEN_KEY);
  }

  login(credentials: LoginRequest): Observable<LoginResponse | null> {
    this._isLoading.set(true);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.storage.set(TOKEN_KEY, response.accessToken);
        this.storage.set(REFRESH_TOKEN_KEY, response.refreshToken);
        this.storage.set(USER_KEY, response.user);
        this._currentUser.set(response.user);
        this._isLoading.set(false);
      }),
      catchError(() => {
        this._isLoading.set(false);
        return of(null);
      }),
    );
  }

  register(data: RegisterRequest): Observable<LoginResponse | null> {
    this._isLoading.set(true);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap((response) => {
        this.storage.set(TOKEN_KEY, response.accessToken);
        this.storage.set(REFRESH_TOKEN_KEY, response.refreshToken);
        this.storage.set(USER_KEY, response.user);
        this._currentUser.set(response.user);
        this._isLoading.set(false);
      }),
      catchError(() => {
        this._isLoading.set(false);
        return of(null);
      }),
    );
  }

  logout(): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(REFRESH_TOKEN_KEY);
    this.storage.remove(USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<LoginResponse | null> {
    const refreshToken = this.storage.get<string>(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.logout();
      return of(null);
    }
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((response) => {
        this.storage.set(TOKEN_KEY, response.accessToken);
        this.storage.set(REFRESH_TOKEN_KEY, response.refreshToken);
      }),
      catchError(() => {
        this.logout();
        return of(null);
      }),
    );
  }
}
