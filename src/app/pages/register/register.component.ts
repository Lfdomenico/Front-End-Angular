// register.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService, ClienteRequest, ClienteResponse } from '../../services/cliente.service';

// 1. IMPORTE O SWEETALERT AQUI
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit { 
  
  registerForm!: FormGroup; 
  mensagemSucesso = '';
  mensagemErro = '';
  hideRegisterPassword = true;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      telefone: ['', Validators.required],
      agencia: ['', Validators.required],
      conta: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Adicionei a validação de email
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();
  
    if (this.registerForm.invalid) {
      const errorMessage = this.getErrorMessage();
      
      // 2. SUBSTITUA O alert() PELO Swal.fire()
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        html: errorMessage, // Usamos 'html' para permitir quebras de linha com <br>
        confirmButtonColor: '#c62828', // Cor vermelha do seu design
        confirmButtonText: 'Entendi'
      });
      
      return;
    }
  
    const clienteParaCadastrar: ClienteRequest = this.registerForm.value;
    this.clienteService.cadastrar(clienteParaCadastrar).subscribe({
      next: (resposta) => {
        // 3. SUBSTITUA O alert() DE SUCESSO
        Swal.fire({
          icon: 'success',
          title: 'Cadastro Realizado!',
          text: `Cliente ${resposta.nome} cadastrado com sucesso!`,
          timer: 2000, // O pop-up fecha sozinho após 2 segundos
          showConfirmButton: false
        }).then(() => {
            this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar:', err);

        // 4. SUBSTITUA O alert() DE ERRO NO SERVIDOR
        Swal.fire({
          icon: 'error',
          title: 'Erro no Servidor',
          text: 'Não foi possível realizar o cadastro no momento. Tente novamente mais tarde.',
          confirmButtonColor: '#c62828',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  private getErrorMessage(): string {
    if (this.hasRequiredErrors()) {
      return 'Todos os campos são obrigatórios. Por favor, preencha todos.';
    }
  
    const errors = [];
    const controls = this.registerForm.controls;
  
    if (controls['email'].hasError('email')) {
      errors.push('O formato do e-mail é inválido.');
    }
    if (controls['cpf'].hasError('pattern')) {
      errors.push('O CPF deve conter exatamente 11 números.');
    }
    if (controls['senha'].hasError('minlength')) {
      errors.push('A Senha deve ter no mínimo 6 caracteres.');
    }
    
    // Usamos <br> para quebras de linha no HTML do pop-up
    return errors.join('<br>'); 
  }

  private hasRequiredErrors(): boolean {
    // ... (esta função não precisa de mudanças)
    for (const key in this.registerForm.controls) {
      if (this.registerForm.controls[key].hasError('required')) {
        return true;
      }
    }
    return false;
  }
  
  toggleRegisterPasswordVisibility(): void {
    this.hideRegisterPassword = !this.hideRegisterPassword;
  }
}