import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/login-service/auth.service';
import { Router } from '@angular/router';
import { LoginUserDto, RegisterUserDto, TokenResponseDto } from '../../interfaces/auth';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './login2.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private router = inject(Router);
  private readonly PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  loading: boolean = false;
  error: string | null = null;

  registerUser: RegisterUserDto = {
    name: '',
    email: '',
    password: '',
  };

  loginUser: LoginUserDto = {
    email: '',
    password: ''
  };

  isLoginView: boolean = true;
  isMobileView: boolean = true;

  loginForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  loginFormCel: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  registerForm: FormGroup = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN), this.samePassword()]),
    email: new FormControl('', [Validators.required, Validators.email], [this.emailAvailable()])
  });

  registerFormCel: FormGroup = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN), this.samePassword()]),
    email: new FormControl('', [Validators.required, Validators.email], [this.emailAvailable()])
  });

  private subscriptions: Subscription[] = [];

  onSubmitLogin(): void {
    if (this.loginForm.valid || this.loginFormCel.valid) {
      this.loading = true;
      this.error = null;
  
      this.loginUser = {
        email: this.loginForm.valid ? this.loginForm.get('email')?.value : this.loginFormCel.get('email')?.value,
        password: this.loginForm.valid ? this.loginForm.get('password')?.value : this.loginFormCel.get('password')?.value,
      };
  
      const loginSubscription = this.authService.login(this.loginUser).subscribe({
        next: (response: TokenResponseDto) => {
          Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            text: 'Bienvenido de vuelta',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              title: 'custom-swal-title',
              popup: 'custom-swal-content',
              confirmButton: 'custom-swal-confirm-button'
            }
          }).then(() => {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
            this.loginForm.reset();
            this.loginFormCel.reset();
          });
        },
        error: (error) => {
          this.authService.logout();
          let errorMessage = 'Error desconocido';
          if (error.status === 401) {
            errorMessage = error.error?.message || 'Credenciales inválidas';
          }
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: errorMessage || 'Error desconocido',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#33A3AA',
            customClass: {
              title: 'custom-swal-title',
              popup: 'custom-swal-content',
              confirmButton: 'custom-swal-confirm-button'
            }
          });          
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  
      this.subscriptions.push(loginSubscription);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos requeridos correctamente',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#33A3AA',
        customClass: {
          title: 'custom-swal-title',
          popup: 'custom-swal-content',
          confirmButton: 'custom-swal-confirm-button'
        }
      });
      
      this.loginForm.markAllAsTouched();
      this.loginFormCel?.markAllAsTouched();
    }
  }

  onSubmitRegister(): void {
    if (this.registerForm.valid || this.registerFormCel.valid) {
      this.loading = true;
      this.error = null;
  
      this.registerUser = {
        name: this.registerForm.valid ? this.registerForm.get('user')?.value : this.registerFormCel.get('user')?.value,
        password: this.registerForm.valid ? this.registerForm.get('password')?.value : this.registerFormCel.get('password')?.value,
        email: this.registerForm.valid ? this.registerForm.get('email')?.value : this.registerFormCel.get('email')?.value
      };
  
      const registerSubscription = this.authService.register(this.registerUser).subscribe({
        next: (response) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Bienvenido a nuestra plataforma',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              title: 'custom-swal-title',
              popup: 'custom-swal-content',
              confirmButton: 'custom-swal-confirm-button'
            }
          }).then(() => {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
            this.registerForm.reset();
            this.registerFormCel.reset();
          });
        },
        error: (error) => {
          this.loading = false;
          this.authService.logout();
          let errorMessage = '';
  
          if (error.status === 500) {
            errorMessage = 'Error en el servidor';
          }
          Swal.fire({
            icon: 'error',
            title: 'Intente más tarde',
            text: errorMessage || 'Error desconocido', 
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#33A3AA',
            customClass: {
              title: 'custom-swal-title',
              popup: 'custom-swal-content', 
              confirmButton: 'custom-swal-confirm-button'
            }
          });
          
          
        },
        complete: () => {
          this.loading = false;
        }
      });
  
      this.subscriptions.push(registerSubscription);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos requeridos correctamente',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#33A3AA'
      });
  
      this.registerForm.markAllAsTouched();
      this.registerFormCel?.markAllAsTouched();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  samePassword() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const password = control.parent.get('password');
      const repeatPassword = control.value;

      if (!password || !repeatPassword) return null;

      return password.value === repeatPassword ? null : { samePassword: true };
    };
  }

  showPasswordLogin: boolean = false;
  showPasswordRegister: boolean = false;
  showRepeatPasswordRegister: boolean = false;

  togglePasswordVisibilityRegister() {
    this.showPasswordRegister = !this.showPasswordRegister;
  }

  togglePasswordRepeatVisibilityRegister() {
    this.showRepeatPasswordRegister = !this.showRepeatPasswordRegister;
  }

  togglePasswordVisibilityLogin() {
    this.showPasswordLogin = !this.showPasswordLogin;
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    this.isMobileView = !this.isMobileView;
    this.loginForm.reset();
    this.registerForm.reset();
  }
  emailAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.authService.getUsers().pipe(
        map(users => {
          const exists = users.some(u => u.email === control.value);
          return exists ? { emailExist: true } : null;
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

}
