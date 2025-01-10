import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { TokenResponseDto } from '../../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8081/auth';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  login(credentials: { email: string; password: string }): Observable<TokenResponseDto> {
    return this.http.post<TokenResponseDto>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.cookieService.set('access_token', response.access_token, { secure: true, sameSite: 'Strict' });
          this.cookieService.set('refresh_token', response.refresh_token, { secure: true, sameSite: 'Strict' });
        })
      );
  }

  refreshToken(): Observable<TokenResponseDto> {
    const refreshToken = this.cookieService.get('refresh_token');
    return this.http.post<TokenResponseDto>(
      `${this.API_URL}/refresh`,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` }
      }
    ).pipe(
      tap(response => {
        this.cookieService.set('access_token', response.access_token, { secure: true, sameSite: 'Strict' });
        this.cookieService.set('refresh_token', response.refresh_token, { secure: true, sameSite: 'Strict' });
      })
    );
  }

  register(userData: { email: string; password: string }): Observable<TokenResponseDto> {
    return this.http.post<TokenResponseDto>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          this.cookieService.set('access_token', response.access_token, { secure: true, sameSite: 'Strict' });
          this.cookieService.set('refresh_token', response.refresh_token, { secure: true, sameSite: 'Strict' });
        })
      );
  }

  logout(): void {
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
  }

  isAuthenticated(): boolean {
    return this.cookieService.check('access_token');
  }

  getToken(): string {
    return this.cookieService.get('access_token');
  }
}
