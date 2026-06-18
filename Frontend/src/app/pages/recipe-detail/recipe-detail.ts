import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css'
})
export class RecipeDetail implements OnInit {

  recipe: any = null;
  ingredients: any[] = [];
  reviews: any[] = [];
  loading = true;
  loggedUser: any = null;
  isOwner = false;
  newComment = '';
  newRating = 5;
  submitError = '';

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loggedUser = JSON.parse(localStorage.getItem('user') || 'null');
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
      this.isOwner = this.loggedUser && this.recipe.user?._id === this.loggedUser.id;
    } catch (err) {
      console.error('Errore:', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async submitReview() {
    this.submitError = '';
    const token = localStorage.getItem('token');
    const id = this.route.snapshot.paramMap.get('id');
    try {
      const res = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ comment: this.newComment, rating: Number(this.newRating), recipeId: id })
      });
      const data = await res.json();
      if (!res.ok) { this.submitError = data.message; return; }
      this.newComment = '';
      this.newRating = 5;
      if (id) this.loadRecipe(id);
    } catch (err) {
      this.submitError = 'Errore nell\'invio della recensione';
    }
  }

  getStars(rating: number): string {
    if (!rating) return '';
    return '⭐'.repeat(Math.round(rating));
  }
}