import { Component, OnInit } from '@angular/core';
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
    private route: ActivatedRoute
  ) {}

  // utente loggato (da localStorage)
  loggedUser: any = null;

  // utente di cui stiamo guardando il profilo (può essere se stesso o un altro)
  user: any = null;

  // true se sto guardando il mio profilo, false se è quello di un altro utente
  isOwnProfile = true;

  // ricette dell'utente mostrato
  myRecipes: any[] = [];

  // recensioni ricevute sulle ricette dell'utente mostrato (solo se profilo altrui)
  comments: any[] = [];

  loading = true;

  ngOnInit() {
    const stored = localStorage.getItem('user');
    this.loggedUser = stored ? JSON.parse(stored) : null;

    const routeId = this.route.snapshot.paramMap.get('id');

    if (!routeId) {
      // nessun id in rotta -> profilo proprio
      if (!this.loggedUser) {
        this.router.navigate(['/login']);
        return;
      }
      this.isOwnProfile = true;
      this.user = this.loggedUser;
      this.loadOwnData();
    } else {
      // id in rotta -> profilo di un utente specifico
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
    }
  }

  // media valutazioni
  get avgRating(): string {
    if (this.myRecipes.length === 0) return '0';
    const avg = this.myRecipes.reduce((sum: number, r: any) => sum + (Number(r.avg_rating) || 0), 0) / this.myRecipes.length;
    return avg.toFixed(1);
  }

  // migliori 2 ricette per rating
  get bestRecipes() {
    return [...this.myRecipes]
      .sort((a, b) => (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0))
      .slice(0, 2);
  }

  getStars(rating: number): string {
    const full = Math.round(rating || 0);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  // iniziali dell'utente per l'avatar
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