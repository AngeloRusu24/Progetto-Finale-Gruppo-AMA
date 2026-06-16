import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { NgIf } from "@angular/common"

@Component({
  selector: 'app-register',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm : FormGroup = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    surname: new FormControl<string>('', Validators.required),
    birthDate: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', Validators.required)
  });

  onSubmit():void{
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }

  const password = this.registerForm.get('password')?.value;
  const confirmPassword = this.registerForm.get('confirmPassword')?.value;

  if(password !== confirmPassword){
    alert('Le password non coincidono');
    return;
  }

  this.registerForm.reset();
  }

}
