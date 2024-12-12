import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+\d{1,3}\d{9,}$/)]],
      dateOfBirth: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    const formData = this.registerForm.value;

    // Validação de senha
    if (formData.password !== formData.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem!';
      this.isSubmitting = false;
      return;
    }

    // Remover o campo de confirmação antes de enviar
    delete formData.confirmPassword;

    // Chamada ao serviço AuthService
    this.authService.register(formData).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Erro ao cadastrar. Tente novamente.';
        this.isSubmitting = false;
      },
    });
  }
}
