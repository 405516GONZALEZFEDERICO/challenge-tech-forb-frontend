import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/login-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','./login2.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {


  private authService = inject(AuthService);
  private router = inject(Router);
  private readonly PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  showPassword: boolean = false;
  showRepeatPassword: boolean = false;

  loading: boolean = false;
  error: string | null = null;
  isLoginView: boolean = true;
  isMobileView: boolean = true;

  loginForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required,Validators.pattern(this.PASSWORD_PATTERN)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  loginFormCel: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required,Validators.pattern(this.PASSWORD_PATTERN)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  registerForm: FormGroup = new FormGroup({
    user: new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required,Validators.pattern(this.PASSWORD_PATTERN)]),
    repeatPassword: new FormControl('', [Validators.required,Validators.pattern(this.PASSWORD_PATTERN), this.samePassword()]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  registerFormCel: FormGroup = new FormGroup({
    user: new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required,Validators.pattern(this.PASSWORD_PATTERN)]),
    repeatPassword: new FormControl('', [Validators.required,Validators.pattern(this.PASSWORD_PATTERN), this.samePassword()]),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  showRepeatPasswordMob: boolean=false;
  onSubmitLogin(): void {
    if (this.loginForm.valid || this.loginFormCel.valid) {
      this.loading = true;
      this.error = null;
  
      const credentials = {
        email: this.loginForm.get('email')?.value || this.loginFormCel.get('email')?.value,
        password: this.loginForm.get('password')?.value || this.loginFormCel.get('password')?.value,
      };
  
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful');
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        },
        error: (error) => {
          console.error('Login failed', error);
          this.authService.logout(); 
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
  onSubmitRegister(): void {
    if (this.registerForm.valid || this.registerFormCel.valid) {
      this.loading = true;
      this.error = null;
  
      const user = {
        name: this.registerForm.get('user')?.value || this.registerFormCel.get('user')?.value,
        email: this.registerForm.get('email')?.value || this.registerFormCel.get('email')?.value,
        password: this.registerForm.get('password')?.value || this.registerFormCel.get('password')?.value
      };
  
      this.authService.register(user).subscribe({
        next: (response) => {
          console.log('Register successful');
        },
        error: (error) => {
          console.error('Register failed', error);
          this.authService.logout(); 
          if (error.status === 400) {
            this.error = 'Invalid data request';
          } else if (error.status === 500) {
            this.error = 'Datos inválidos';
          } else {
            this.error = 'Error interno';
          }
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
}

  

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

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
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  togglePasswordVisibilityy() :void{
    this.showRepeatPasswordMob = !this.showRepeatPasswordMob;

    }
  togglePasswordVisibilityT(): void {
    this.showRepeatPassword = !this.showRepeatPassword;
  }
  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    this.isMobileView = !this.isMobileView;
    this.loginForm.reset();
    this.registerForm.reset();
  }

}


