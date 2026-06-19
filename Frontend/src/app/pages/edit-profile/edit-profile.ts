import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  loading = false;
  errorMessage = '';

  form = {
    username: '',
    bio: '',
    birthDate: '',
    location: '',
  };

  ngOnInit() {
    // precompila il form con i dati attuali salvati in localStorage
    const stored = localStorage.getItem('user');
    if (!stored) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(stored);
    this.form.username = user.username || '';
    this.form.bio = user.bio || '';
    this.form.location = user.location || '';

    // formatta la data per l'input type="date" (YYYY-MM-DD)
    if (user.birthDate) {
      this.form.birthDate = new Date(user.birthDate).toISOString().split('T')[0];
    }
  }

  async onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const res = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: this.form.username,
          bio: this.form.bio,
          birthDate: this.form.birthDate || null,
          location: this.form.location,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        this.errorMessage = data.message || 'Errore nell\'aggiornamento del profilo';
        return;
      }

      // aggiorna i dati salvati in localStorage con quelli nuovi
      const stored = localStorage.getItem('user');
      const currentUser = stored ? JSON.parse(stored) : {};
      const updatedUser = { ...currentUser, ...data, id: data._id };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      this.router.navigate(['/profile']);

    } catch (err) {
      this.errorMessage = 'Errore di connessione al server';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }
}
