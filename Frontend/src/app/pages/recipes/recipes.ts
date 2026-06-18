import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  user: any = null;
  showMenu = false;
  tags = ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Pasta', 'Carne', 'Pesce', 'Vegani'];
  selectedTags: string[] = [];
  searchUsername = '';
  recipes: any[] = [];
  loading = true;

  ngOnInit() {
    const stored = localStorage.getItem('user');
    if (stored) this.user = JSON.parse(stored);
    this.loadRecipes();
  }

  get initials(): string {
    if (!this.user?.username) return '?';
    return this.user.username.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
    this.showMenu = false;
    this.router.navigate(['/']);
  }

  async loadRecipes() {
    this.loading = true;
    try {
      const res = await fetch('http://localhost:3000/api/recipes');
      this.recipes = await res.json();
    } catch (err) {
      console.error('Errore:', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

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

  // get filteredRecipes() {
  //   if (this.selectedTags.length === 0) return this.recipes;
  //   return this.recipes.filter(r =>
  //     this.selectedTags.some(tag => r.category === tag)
  //   );
  // }

  get filteredRecipes() {
    return this.recipes.filter(r => {
      // 1. Filtro per Tag (se ci sono tag selezionati, la ricetta deve corrispondere)
      const matchesTag = this.selectedTags.length === 0 || this.selectedTags.includes(r.category);

      // 2. Filtro per Nome dello Chef (case-insensitive, controlla se include il testo cercato)
      const chefName = r.user?.username || '';
      const matchesChef = chefName.toLowerCase().includes(this.searchUsername.toLowerCase());

      // La ricetta deve superare entrambi i filtri
      return matchesTag && matchesChef;
    });
  }

  getStars(rating: number): string {
    if (!rating) return '';
    return '⭐'.repeat(Math.round(rating));
  }

  goToAddRecipe() {
    this.router.navigate(['/recipes/new']);
  }
}
