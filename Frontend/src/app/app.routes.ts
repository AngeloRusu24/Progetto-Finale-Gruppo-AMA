import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { Register } from './pages/register/register';
import { RecipesComponent } from './pages/recipes/recipes';
import { Login } from './pages/login/login';
import { AddRecipeComponent } from './pages/add-recipe/add-recipe';
import { RecipeDetail } from './pages/recipe-detail/recipe-detail';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipes/new', component: AddRecipeComponent, canActivate: [authGuard] },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'recipe/:id', component: RecipeDetail, canActivate: [authGuard] },
];
