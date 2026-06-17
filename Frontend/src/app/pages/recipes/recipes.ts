import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class RecipesComponent {

  constructor(private router: Router) {}

  // Filtri disponibili
  tags = ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Pasta', 'Carne', 'Pesce', 'Vegani'];

  // Tag selezionati (multi-select)
  selectedTags: string[] = [];

  // Ricette (mock — poi arriveranno dal backend)
  recipes = [
    { title: 'Carbonara',           time: 20, difficulty: 'Media',  emoji: '🍝', bg: 'warm',  tags: ['Primi', 'Pasta', 'Carne'] },
    { title: 'Insalata Greca',      time: 10, difficulty: 'Facile', emoji: '🥗', bg: 'green', tags: ['Antipasti', 'Vegani'] },
    { title: 'Tiramisù',            time: 40, difficulty: 'Facile', emoji: '🍰', bg: 'amber', tags: ['Dolci'] },
    { title: 'Salmone alla griglia',time: 25, difficulty: 'Media',  emoji: '🐟', bg: 'warm',  tags: ['Secondi', 'Pesce'] },
  ];

  // Selezione / deselezione tag
  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
  }

  // Ricette filtrate (AND: devono avere tutti i tag selezionati)
  get filteredRecipes() {
    if (this.selectedTags.length === 0) return this.recipes;
    return this.recipes.filter(r =>
      this.selectedTags.every(tag => r.tags.includes(tag))
    );
  }

  // Naviga alla pagina aggiungi ricetta
  goToAddRecipe() {
    this.router.navigate(['/recipes/new']);
  }

  // Torna alla home / esplora
  goHome() {
    this.router.navigate(['/']);
  }
}
