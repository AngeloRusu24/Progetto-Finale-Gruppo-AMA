import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  user: any = null;
  showMenu = false;

  stats = [
    { label: 'Ricette pubblicate', value: '120+' },
    { label: 'Chef registrati', value: '340+' },
    { label: 'Recensioni lasciate', value: '890+' },
  ];

  ngOnInit() {
    const stored = localStorage.getItem('user');
    if (stored) this.user = JSON.parse(stored);
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
    this.cdr.detectChanges();
  }
}
