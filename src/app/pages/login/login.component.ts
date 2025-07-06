// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   // A lógica do seu componente virá aqui
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Importado aqui

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink], // Adicione CommonModule aqui para usar [type] e {{}}
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Note que aqui é styleUrls (plural)
})
export class LoginComponent {
  // Variável para controlar a visibilidade da senha
  hidePassword = true;

  // Função que será chamada pelo clique no ícone
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}