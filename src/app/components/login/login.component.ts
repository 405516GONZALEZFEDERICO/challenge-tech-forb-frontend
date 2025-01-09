import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/login/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit,OnDestroy{

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      firstValueFrom(this.authService.login(credentials))
        .then(response => {
          console.log('Login successful', response);
          // Redirigir a la página deseada después del inicio de sesió
        })
        .catch(error => {
          console.error('Login failed', error);
          // Manejar el error de inicio de sesión
        });
    } else {
      console.log('Form is invalid');
    }
  }

  private authService = inject(AuthService);

  showPassword: boolean = false;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loginForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email,])
  });
}


