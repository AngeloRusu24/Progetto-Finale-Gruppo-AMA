import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class RecipesComponent {

  //filtri disponibili
  tags = [
    'Antipasti',
    'Primi',
    'Secondi',
    'Dolci',
    'Pasta',
    'Carne',
    'Pesce',
    'Vegani'
  ];

  // tag selezionati (multi-select)
  selectedTags: string[] = [];

  // 🍝 ricette
  recipes = [
    {
      title: 'Carbonara',
      time: 20,
      difficulty: 'Media',
      image: '🍝',
      tags: ['Primi', 'Pasta', 'Carne']
    },
    {
      title: 'Insalata Greca',
      time: 10,
      difficulty: 'Facile',
      image: '🥗',
      tags: ['Antipasti', 'Vegani']
    },
    {
      title: 'Tiramisù',
      time: 40,
      difficulty: 'Facile',
      image: '🍰',
      tags: ['Dolci']
    },
    {
      title: 'Salmone alla griglia',
      time: 25,
      difficulty: 'Media',
      image: '🐟',
      tags: ['Secondi', 'Pesce']
    }
  ];

  // selezione/deselezione tag
  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
  }

  // filtro ricette (AND tra tag selezionati)
  get filteredRecipes() {
    if (this.selectedTags.length === 0) {
      return this.recipes;
    }

    return this.recipes.filter(recipe =>
      this.selectedTags.every(tag => recipe.tags.includes(tag))
    );
  }
}
