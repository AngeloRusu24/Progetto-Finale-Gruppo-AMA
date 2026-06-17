import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class RecipesComponent implements OnInit {

  constructor(private router: Router) {}

  // filtri disponibili
  tags = ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Pasta', 'Carne', 'Pesce', 'Vegani'];

  // tag selezionati (multi-select)
  selectedTags: string[] = [];

  // ricerca per username
  searchUsername = '';

  // ricette caricate dall'API
  recipes: any[] = [];

  // stato di caricamento
  loading = true;

  ngOnInit() {
    this.loadRecipes();
  }

  async loadRecipes() {
    this.loading = true;
    try {
      const params = new URLSearchParams();
      if (this.selectedTags.length === 1) params.set('category', this.selectedTags[0]);
      if (this.searchUsername) params.set('username', this.searchUsername);

      const res = await fetch(`http://localhost:3000/api/recipes?${params.toString()}`);
      this.recipes = await res.json();
    } catch (err) {
      console.error('Errore nel caricamento delle ricette', err);
    } finally {
      this.loading = false;
    }
  }

  // selezione / deselezione tag
  toggleTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.loadRecipes();
  }

  onSearchUsername(event: Event) {
    this.searchUsername = (event.target as HTMLInputElement).value;
    this.loadRecipes();
  }

  // ricette filtrate lato client per multi-tag
  get filteredRecipes() {
    if (this.selectedTags.length === 0) return this.recipes;
    return this.recipes.filter(r =>
      this.selectedTags.every(tag => r.category === tag || r.tags?.includes(tag))
    );
  }

  // stelle dalla valutazione media
  getStars(rating: number): string {
    if (!rating) return '';
    return '⭐'.repeat(Math.round(rating));
  }

  goToAddRecipe() {
    this.router.navigate(['/recipes/new']);
  }
}