import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  recipe: any = null;
  ingredients: any[] = [];
  reviews: any[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadRecipe(id);
  }

  async loadRecipe(id: string) {
    try {
      const [recipeRes, ingredientsRes, reviewsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/recipes/${id}`),
        fetch(`http://localhost:3000/api/ingredients/recipe/${id}`),
        fetch(`http://localhost:3000/api/reviews/recipe/${id}`)
      ]);

      this.recipe = await recipeRes.json();
      this.ingredients = await ingredientsRes.json();
      this.reviews = await reviewsRes.json();
    } catch (err) {
      console.error('Errore:', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  getStars(rating: number): string {
    if (!rating) return '';
    return '⭐'.repeat(Math.round(rating));
  }
}
