import {  Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { TarotListComponent } from './pages/tarot-list/tarot-list.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ConsultantPageComponent } from './pages/consultant-page/consultant-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { GuestGuard } from './services/guards/guest-guard.service';
import { AuthGuard } from './services/guards/auth-guard.service';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:id', component: CategoryPageComponent },
  { path: 'tarot', component: TarotListComponent, canActivate: [AuthGuard]  },
  { path: 'product/:id', component: ProductPageComponent },
  { path: 'consultant/:id', component: ConsultantPageComponent },
  { path: 'shopping-cart', component: CartPageComponent, canActivate: [AuthGuard]  },
  { path: 'login', component: LoginPageComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterPageComponent,  canActivate: [GuestGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];