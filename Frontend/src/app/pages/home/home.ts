import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  portate = ['Antipasti', 'Primi', 'Secondi', 'Dolci'];
  ingredienti = ['Pasta', 'Carne', 'Pesce', 'Vegano'];
  selectedPortata = '';
  selectedIngrediente = '';

  // testo cercato per username
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
      // costruisce i parametri di ricerca dinamicamente
      const params = new URLSearchParams();
      if (this.selectedPortata) params.set('category', this.selectedPortata);
      if (this.searchUsername) params.set('username', this.searchUsername);

      const res = await fetch(`http://localhost:3000/api/recipes?${params.toString()}`);
      this.recipes = await res.json();
    } catch (err) {
      console.error('Errore nel caricamento delle ricette', err);
    } finally {
      this.loading = false;
    }
  }

  selectPortata(cat: string) {
    // deseleziona se clicchi sulla stessa
    this.selectedPortata = this.selectedPortata === cat ? '' : cat;
    this.loadRecipes();
  }

  selectIngrediente(ing: string) {
    this.selectedIngrediente = this.selectedIngrediente === ing ? '' : ing;
    this.loadRecipes();
  }

  onSearchUsername(event: Event) {
    this.searchUsername = (event.target as HTMLInputElement).value;
    this.loadRecipes();
  }

  // restituisce le stelle in base alla valutazione
  getStars(rating: number): string {
    if (!rating) return '';
    return '⭐'.repeat(Math.round(rating));
  }
}