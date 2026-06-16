import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';

import { RecipesComponent } from './pages/recipes/recipes';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'recipes', component: RecipesComponent }

import { Register } from './pages/register/register';

export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  {path:'register', component:Register}

];
