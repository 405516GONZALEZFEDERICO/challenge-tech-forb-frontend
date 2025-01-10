import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../services/login/auth.service';
import { AuthService } from '../../services/login-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  
})
export class LoginComponent implements OnInit,OnDestroy{

  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  loginForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  loginFormCel: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = null;
      
      const credentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful');
          this.router.navigate(['/dashboard']); 
        },
        error: (error) => {
          console.error('Login failed', error);
          if (error.status === 404) {
            this.error = 'Usuario no encontrado';
          } else if (error.status === 400) {
            this.error = 'Datos inválidos';
          } else {
            this.error = 'Error del servidor';
          }
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
   
  }

  ngOnDestroy(): void {
   
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}


