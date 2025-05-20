import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.decodeUserFromToken(token);
    }
    if (refreshToken) {
      this.refreshTokenSubject.next(refreshToken);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.decodeUserFromToken(response.accessToken);
        this.refreshTokenSubject.next(response.refreshToken);
      }),
      catchError((err) => throwError(() => new Error(err.error.message || 'Login failed')))
    );
  }

  register(username: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password, role }).pipe(
      catchError((err) => throwError(() => new Error(err.error.message || 'Registration failed')))
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.refreshTokenSubject.value;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap((response: any) => {
        localStorage.setItem('accessToken', response.accessToken);
        this.decodeUserFromToken(response.accessToken);
      }),
      catchError((err) => {
        this.logout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
    this.refreshTokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private decodeUserFromToken(token: string) {
    const decoded = this.jwtHelper.decodeToken(token);
    this.currentUserSubject.next({
      _id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      createdAt: '',
      updatedAt: '',
    });
  }
}