import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MenuClienteComponent } from './pages/menu-cliente/menu-cliente.component';
import { AuthGuard } from './guards/auth.guard';
import { TesteComponent } from './pages/teste/teste';
import { AgendamentoComponent } from './pages/agendamento/agendamento';
import { LandingComponent } from './pages/landing-page/landing.component';
import { EsperaAtendimentoComponent } from './pages/espera-atendimento1/espera-atendimento1.component'; 
import { DocumentoUploadPageComponent } from './pages/documentos-upload/documento-upload-page.component';
import { MenuFuncionarioComponent } from './pages/menu-funcionario/menu-funcionario.component';
import { AgendamentoFuncionarioComponent } from './pages/agendamento-funcionario/agendamento-funcionario';



export const routes: Routes = [

  {path: '', redirectTo: 'home', pathMatch: 'full'},

  {path: 'home', component: LandingComponent},

 // { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },

  {path: 'register', component: RegisterComponent},

  {path: 'teste', component: TesteComponent},

  {
    path: 'menu-cliente',
    component: MenuClienteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu-funcionario',
    component: MenuFuncionarioComponent,
    //canActivate: [AuthGuard] // trocar depois para o token do JWT
  },
  // {
  //   path: 'espera/:setorNome',
  //   component: EsperaAtendimentoComponent,
  //   canActivate: [AuthGuard]
  // },

  // {path: 'agendamento', component: AgendamentoComponent},

  // ALTERAÇÃO 1: A rota de espera agora espera um 'id'
  {
    path: 'espera/:id',
    component: EsperaAtendimentoComponent,
    canActivate: [AuthGuard]
  },
  // ALTERAÇÃO 2: A rota de agendamento agora também espera um 'id'
  {
    path: 'agendamento/:id',
    component: AgendamentoComponent,
    canActivate: [AuthGuard] // É uma boa prática proteger esta rota também
  },

  { path: 'documentos/upload', component: DocumentoUploadPageComponent },

  { 
    path: 'menu-funcionario/agendamentos', 
    component: AgendamentoFuncionarioComponent,
    // canActivate: [AuthGuard]
   }
];
