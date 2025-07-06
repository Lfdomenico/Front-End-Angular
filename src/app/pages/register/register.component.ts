import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 1. Importe o RouterLink

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  // Variável para controlar a visibilidade da senha DESTA PÁGINA
  hideRegisterPassword = true;

  // Função para alternar a visibilidade da senha DESTA PÁGINA
  toggleRegisterPasswordVisibility(): void {
    this.hideRegisterPassword = !this.hideRegisterPassword;
  }
}