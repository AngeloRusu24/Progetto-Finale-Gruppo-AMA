import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { Register } from './pages/register/register';
import { RecipesComponent } from './pages/recipes/recipes';
import { Login } from './pages/login/login';
import { AddRecipeComponent } from './pages/add-recipe/add-recipe';
<<<<<<< HEAD
=======

>>>>>>> f3f1b55d4d1a0d0509de9d02990eb54da6f1beac
import { RecipeDetail } from './pages/recipe-detail/recipe-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipes/new', component: AddRecipeComponent },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'recipe/:id', component: RecipeDetail }
];
