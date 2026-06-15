import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  categories = ['Tutti', 'Pasta', 'Dolci', 'Vegano', 'Carne', 'Pesce'];
  selectedCategory = 'Tutti';

  recipes = [
    { title: 'Spaghetti alla Carbonara', author: 'Marco R.', category: 'Pasta', emoji: '🍝', bg: '#FFF3EC' },
    { title: 'Insalata Greca', author: 'Sofia L.', category: 'Vegano', emoji: '🥗', bg: '#F1F8EC' },
    { title: 'Tiramisù Classico', author: 'Giulia B.', category: 'Dolci', emoji: '🍮', bg: '#FFF8EC' },
  ];

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }
}