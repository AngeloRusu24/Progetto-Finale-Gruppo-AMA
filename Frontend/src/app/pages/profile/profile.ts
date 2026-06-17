import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router) {}

  // dati utente dal localStorage
  user: any = null;

  // ricette dell'utente caricate dall'API
  myRecipes: any[] = [];

  // recensioni ricevute sulle ricette dell'utente
  comments: any[] = [];

  loading = true;

  ngOnInit() {
    // recupera utente salvato al login
    const stored = localStorage.getItem('user');
    if (!stored) {
      // se non loggato, reindirizza al login
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(stored);
    this.loadData();
  }

  async loadData() {
    const token = localStorage.getItem('token');
    try {
      // carica le mie ricette e le recensioni in parallelo
      const [recipesRes, reviewsRes] = await Promise.all([
        fetch('http://localhost:3000/api/recipes/mine', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3000/api/reviews/mine', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      this.myRecipes = await recipesRes.json();
      this.comments = await reviewsRes.json();
    } catch (err) {
      console.error('Errore nel caricamento del profilo', err);
    } finally {
      this.loading = false;
    }
  }

  // media valutazioni
  get avgRating(): string {
    if (this.myRecipes.length === 0) return '0';
    const avg = this.myRecipes.reduce((sum: number, r: any) => sum + (r.avg_rating || 0), 0) / this.myRecipes.length;
    return avg.toFixed(1);
  }

  // migliori 2 ricette per rating
  get bestRecipes() {
    return [...this.myRecipes]
      .sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
      .slice(0, 2);
  }

  getStars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  // iniziali dell'utente per l'avatar
  get initials(): string {
    if (!this.user?.username) return '?';
    return this.user.username.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}