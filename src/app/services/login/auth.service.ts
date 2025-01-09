import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { RegisterUserDto, TokenResponseDto, LoginUserDto } from '../../components/interfaces/auth';
import { CookieOptions, CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://your-api-url';
  private readonly TOKEN_COOKIE = 'auth_token';
  private readonly REFRESH_TOKEN_COOKIE = 'refresh_token';

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  private cookieOptions: CookieOptions = {
    path: '/',
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  };

  register(userData: RegisterUserDto): Observable<TokenResponseDto> {
    return this.http.post<TokenResponseDto>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => throwError(() => error))
      );
  }

  login(credentials: LoginUserDto): Observable<TokenResponseDto> {
    return this.http.post<TokenResponseDto>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => throwError(() => error))
      );
  }

  refreshToken(): Observable<TokenResponseDto> {
    const refreshToken = this.cookieService.get(this.REFRESH_TOKEN_COOKIE);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);
    
    return this.http.post<TokenResponseDto>(`${this.API_URL}/auth/refresh`, {}, { headers })
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => throwError(() => error))
      );
  }

  private handleAuthResponse(response: TokenResponseDto): void {
    if (response?.token && response?.refreshToken) {
      this.cookieService.put(this.TOKEN_COOKIE, response.token, this.cookieOptions);
      this.cookieService.put(this.REFRESH_TOKEN_COOKIE, response.refreshToken, this.cookieOptions);
    }
  }

  getToken(): string | undefined {
    return this.cookieService.get(this.TOKEN_COOKIE);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.cookieService.remove(this.TOKEN_COOKIE);
    this.cookieService.remove(this.REFRESH_TOKEN_COOKIE);
  }
}