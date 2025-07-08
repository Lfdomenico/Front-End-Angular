// import { Routes } from '@angular/router';

// export const routes: Routes = [];
import { Routes } from '@angular/router';
// Assumindo que seu componente de login foi criado em pages/login
import { LoginComponent } from './pages/login/login.component'; 

import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  // Quando o caminho for vazio ('/'), redireciona para a rota '/login'
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Quando o caminho for '/login', renderiza o LoginComponent
  { path: 'login', component: LoginComponent },

  {path: 'register', component: RegisterComponent}
];