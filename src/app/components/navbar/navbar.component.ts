// src/app/components/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  userName: string | null = null;
  userEmail: string | null = null;
  userInitial: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Busca os dados salvos pelo ClienteService durante o login
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmail');

    // Define a inicial do usuário (dando preferência ao nome)
    if (this.userName) {
      this.userInitial = this.userName.charAt(0).toUpperCase();
    } else if (this.userEmail) {
      this.userInitial = this.userEmail.charAt(0).toUpperCase();
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown foi clicado! Novo estado de isDropdownOpen:', this.isDropdownOpen);
  }

  logout(): void {
    // Limpa TODOS os dados de autenticação do localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName'); // <-- IMPORTANTE: Limpar o nome também
    localStorage.removeItem('userEmail');

    // Fecha o dropdown para não ficar aberto na tela de login
    this.isDropdownOpen = false;

    // Redireciona para a página de login
    this.router.navigate(['/login']);
  }
}