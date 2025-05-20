import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5001/api/users';

  constructor(private http: HttpClient) {}

  getUsers(role?: string): Observable<any> {
      const params: { [param: string]: string } | undefined = role ? { role } : undefined;
    return this.http.get(this.apiUrl, { params }).pipe(
      catchError((err) => throwError(() => new Error(err.error.message || 'Failed to fetch users')))
    );
  }

  updateRole(userId: string, role: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/role`, { role }).pipe(
      catchError((err) => throwError(() => new Error(err.error.message || 'Failed to update role')))
    );
  }
}