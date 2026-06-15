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
  portate = ['Antipasti', 'Primi', 'Secondi', 'Dolci'];
  ingredienti = ['Pasta', 'Carne', 'Pesce', 'Vegano'];

  selectedPortata = '';
  selectedIngrediente = '';

  recipes = [
    { title: 'Spaghetti alla Carbonara', author: 'Marco R.', category: 'Primi', ingrediente: 'Pasta', emoji: '🍝', bg: '#FFF3EC' },
    { title: 'Insalata Greca', author: 'Sofia L.', category: 'Secondi', ingrediente: 'Vegano', emoji: '🥗', bg: '#F1F8EC' },
    { title: 'Tiramisù Classico', author: 'Giulia B.', category: 'Dolci', ingrediente: '', emoji: '🍮', bg: '#FFF8EC' },
  ];

  selectPortata(cat: string) {
    this.selectedPortata = this.selectedPortata === cat ? '' : cat;
  }

  selectIngrediente(ing: string) {
    this.selectedIngrediente = this.selectedIngrediente === ing ? '' : ing;
  }
}