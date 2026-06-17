import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  constructor(private router: Router) {}

  errorMessage = '';
  loading = false;

  registerForm: FormGroup = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    surname: new FormControl<string>('', Validators.required),
    birthDate: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', Validators.required)
  });

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Le password non coincidono';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // username costruito da nome e cognome
          username: `${this.registerForm.value.name} ${this.registerForm.value.surname}`,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        this.errorMessage = data.message || 'Errore durante la registrazione';
        return;
      }

      // registrazione ok, vai al login
      this.router.navigate(['/login']);

    } catch (err) {
      this.errorMessage = 'Errore di connessione al server';
    } finally {
      this.loading = false;
    }
  }
}