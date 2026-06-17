import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {

  // Dati utente (mock — poi arriveranno dal backend)
  user = {
    name: 'Maria Rossi',
    initials: 'MR',
    email: 'maria@email.com',
    createdAt: 'gennaio 2025'
  };

  // Tutte le ricette dell'utente
  myRecipes = [
    { title: 'Carbonara',      emoji: '🍝', category: 'Primi',   time: 20, difficulty: 'Media',  rating: 4.8 },
    { title: 'Tiramisù',       emoji: '🍮', category: 'Dolci',   time: 40, difficulty: 'Facile', rating: 4.9 },
    { title: 'Pollo al forno', emoji: '🍗', category: 'Secondi', time: 60, difficulty: 'Media',  rating: 4.5 },
  ];

  // Migliori ricette (ordinate per rating)
  get bestRecipes() {
    return [...this.myRecipes]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);
  }

  // Statistiche calcolate
  get avgRating(): string {
    const avg = this.myRecipes.reduce((sum, r) => sum + r.rating, 0) / this.myRecipes.length;
    return avg.toFixed(1);
  }

  // Commenti ricevuti
  comments = [
    { initials: 'MA', user: 'Marco', recipeTitle: 'Carbonara',      text: 'Ricetta fantastica!',          rating: 5 },
    { initials: 'AN', user: 'Anna',  recipeTitle: 'Tiramisù',        text: 'Molto facile da seguire.',     rating: 4 },
    { initials: 'LU', user: 'Luca',  recipeTitle: 'Tiramisù',        text: 'Ottimo risultato!',            rating: 5 },
  ];

  // Genera stringa di stelle (es. 4 → "★★★★☆")
  getStars(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}
