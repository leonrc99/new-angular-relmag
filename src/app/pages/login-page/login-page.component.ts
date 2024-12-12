import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loginForm: FormGroup;
  userNotFound: boolean = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    this.haveLoggedUser();

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  public haveLoggedUser(): void {
    const userInfo = this.authService.decodeToken();

    if (userInfo !== null) {
      this.router.navigate(['/'])
    }
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token);
          this.router.navigate(['/'])
          location.reload();
        },
        error: err => {
          console.error(err);
          this.userNotFound = true;
        }
      })
    }
  }
}
