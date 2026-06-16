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

  // dati utente (mock per ora, poi arriveranno dal backend)
  user = {
    username: 'Maria',
    email: 'maria@email.com',
    createdAt: 'Gennaio 2025'
  };

  // ricette dell’utente
  myRecipes = [
    {
      title: 'Carbonara',
      category: 'Primi',
      time: 20,
      difficulty: 'Media',
      rating: 4.8
    },
    {
      title: 'Tiramisù',
      category: 'Dolci',
      time: 40,
      difficulty: 'Facile',
      rating: 4.9
    },
    {
      title: 'Pollo al forno',
      category: 'Secondi',
      time: 60,
      difficulty: 'Media',
      rating: 4.5
    }
  ];

  // migliori ricette (per ora prese manualmente)
  bestRecipes = [
    this.myRecipes[1],
    this.myRecipes[0]
  ];

  // 💬 commenti ricevuti
  comments = [
    { user: 'Marco', text: 'Ricetta fantastica!', rating: 5, recipeTitle: "Carbonara" },
    { user: 'Anna', text: 'Molto facile da seguire', rating: 4, recipeTitle: "Tiramisù" },
    { user: 'Luca', text: 'Ottimo risultato!', rating: 5, recipeTitle: "Tiramisù" }
  ];
}
