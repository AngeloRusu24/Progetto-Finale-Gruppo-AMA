import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  loggedUser: any = null;
  user: any = null;
  isOwnProfile = true;
  myRecipes: any[] = [];
  comments: any[] = [];
  loading = true;

  // id della ricetta il cui menu "..." è aperto, null se nessuno
  openMenuId: string | null = null;

  ngOnInit() {
    const stored = localStorage.getItem('user');
    this.loggedUser = stored ? JSON.parse(stored) : null;

    const routeId = this.route.snapshot.paramMap.get('id');

    if (!routeId) {
      if (!this.loggedUser) {
        this.router.navigate(['/login']);
        return;
      }
      this.isOwnProfile = true;
      this.user = this.loggedUser;
      this.loadOwnData();
    } else {
      this.isOwnProfile = !!this.loggedUser && (this.loggedUser.id === routeId);
      if (this.isOwnProfile) {
        this.user = this.loggedUser;
        this.loadOwnData();
      } else {
        this.loadOtherUserData(routeId);
      }
    }
  }

  async loadOwnData() {
    const token = localStorage.getItem('token');
    try {
      const recipesRes = await fetch('http://localhost:3000/api/recipes/mine', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      this.myRecipes = await recipesRes.json();
    } catch (err) {
      console.error('Errore nel caricamento del profilo', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadOtherUserData(userId: string) {
    try {
      const [userRes, recipesRes, reviewsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/auth/users/${userId}`),
        fetch(`http://localhost:3000/api/recipes/user/${userId}`),
        fetch(`http://localhost:3000/api/reviews/user/${userId}`)
      ]);

      if (!userRes.ok) {
        this.user = null;
        return;
      }

      this.user = await userRes.json();
      this.myRecipes = await recipesRes.json();
      this.comments = await reviewsRes.json();
    } catch (err) {
      console.error('Errore nel caricamento del profilo', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // apre/chiude il menu "..." di una ricetta specifica
  toggleRecipeMenu(recipeId: string, event: Event) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === recipeId ? null : recipeId;
  }

  // chiude qualsiasi menu aperto (usato cliccando altrove)
  closeMenu() {
    this.openMenuId = null;
  }

  editRecipe(recipeId: string, event: Event) {
    event.stopPropagation();
    this.openMenuId = null;
    this.router.navigate(['/recipes/edit', recipeId]);
  }

  async deleteRecipe(recipeId: string, event: Event) {
    event.stopPropagation();
    this.openMenuId = null;

    const confirmed = confirm('Sei sicuro di voler eliminare questa ricetta? L\'azione non è reversibile.');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        this.myRecipes = this.myRecipes.filter(r => r._id !== recipeId);
        this.cdr.detectChanges();
      } else {
        alert('Errore durante l\'eliminazione della ricetta');
      }
    } catch (err) {
      console.error('Errore eliminazione ricetta:', err);
      alert('Errore di connessione al server');
    }
  }

  get avgRating(): string {
    if (this.myRecipes.length === 0) return '0';
    const avg = this.myRecipes.reduce((sum: number, r: any) => sum + (Number(r.avg_rating) || 0), 0) / this.myRecipes.length;
    return avg.toFixed(1);
  }

  get bestRecipes() {
    return [...this.myRecipes]
      .sort((a, b) => (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0))
      .slice(0, 2);
  }

  getStars(rating: number): string {
    const full = Math.round(rating || 0);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  get initials(): string {
    if (!this.user?.username) return '?';
    return this.user.username.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
