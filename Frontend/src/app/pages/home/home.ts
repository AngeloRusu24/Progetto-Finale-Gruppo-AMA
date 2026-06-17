import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  // statistiche mock, poi le collegheremo all'API
  stats = [
    { label: 'Ricette pubblicate', value: '120+' },
    { label: 'Chef registrati', value: '340+' },
    { label: 'Recensioni lasciate', value: '890+' },
  ];
}