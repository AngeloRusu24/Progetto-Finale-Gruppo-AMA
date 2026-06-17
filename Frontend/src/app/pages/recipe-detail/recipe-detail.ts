import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css'
})
export class RecipeDetail implements OnInit {

  // dati della ricetta caricati dall'API
  recipe: any = null;

  // lista degli ingredienti della ricetta
  ingredients: any[] = [];

  // lista delle recensioni della ricetta
  reviews: any[] = [];

  // stato di caricamento
  loading = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // prende l'id dalla URL es. /recipe/3
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadRecipe(id);
  }

  async loadRecipe(id: string) {
    try {
      // carica ricetta, ingredienti e recensioni in parallelo
      const [recipeRes, ingredientsRes, reviewsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/recipes/${id}`),
        fetch(`http://localhost:3000/api/ingredients/recipe/${id}`),
        fetch(`http://localhost:3000/api/reviews/recipe/${id}`)
      ]);

      this.recipe = await recipeRes.json();
      this.ingredients = await ingredientsRes.json();
      this.reviews = await reviewsRes.json();
    } catch (err) {
      console.error('Errore nel caricamento della ricetta', err);
    } finally {
      this.loading = false;
    }
  }

  // converte il rating numerico in stelle
  getStars(rating: number): string {
    return '⭐'.repeat(Math.round(rating));
  }
}