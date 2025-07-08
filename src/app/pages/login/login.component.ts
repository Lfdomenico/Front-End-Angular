// Em: src/app/pages/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService, LoginRequest } from '../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  // 1. ADICIONE ReactiveFormsModule para formulários
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit { // 2. IMPLEMENTE OnInit

  loginForm!: FormGroup; // 3. Variável para o formulário
  hidePassword = true;

  // 4. INJETE os serviços necessários
  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  // 5. CRIE o formulário quando o componente iniciar
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  // 6. MÉTODO para lidar com a submissão do formulário
  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Marca os campos como "tocados" para exibir erros, se houver
      this.loginForm.markAllAsTouched(); 
      return;
    }

    const credenciais: LoginRequest = this.loginForm.value;

    this.clienteService.login(credenciais).subscribe({
      // CÓDIGO MODIFICADO
next: (response) => {
  console.log('Resposta do servidor:', response); // "Login bem-sucedido"
  
  // Exibe um pop-up de sucesso que fecha sozinho
  Swal.fire({
    icon: 'success',
    title: 'Login Realizado com Sucesso!',
    text: 'Redirecionando para o painel...',
    timer: 1500, // O pop-up fecha após 1.5 segundos
    showConfirmButton: false // Esconde o botão "OK"
  }).then(() => {
    // Após o pop-up fechar, redireciona o usuário
    this.router.navigate(['/dashboard']);
  });
},
      error: (err) => {
        console.error('Erro no login:', err);
        Swal.fire({
          icon: 'error',
          title: 'Falha no Login',
          text: 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.',
          confirmButtonColor: '#c62828'
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}