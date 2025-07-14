import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService, LoginRequest } from '../../services/cliente.service';
import Swal from 'sweetalert2';
import { FuncionarioService } from '../../services/funcionario.service'; // 1. IMPORTE O NOVO SERVIÇO

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup; 
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService, // 2. INJETE O NOVO SERVIÇO
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

//   onSubmit(): void {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched(); 
//       return;
//     }

//     const credenciais: LoginRequest = this.loginForm.value;

//     this.clienteService.login(credenciais).subscribe({
// next: (response) => {
//   console.log('Resposta do servidor:', response);
  
//   Swal.fire({
//     icon: 'success',
//     title: 'Login Realizado com Sucesso!',
//     text: 'Redirecionando para o painel...',
//     timer: 1500,
//     showConfirmButton: false
//   }).then(() => {
//     // redirecionamento do funcionário
//     const email = this.loginForm.get('email')?.value || '';
//     if (email.endsWith('@bankflow')) {
//       // Se for, redireciona para o menu do funcionário
//       this.router.navigate(['/menu-funcionario']);
//     }else{
//       this.router.navigate(['/menu-cliente']);
//     }
    
//   });
// },
//       error: (err) => {
//         console.error('Erro no login:', err);
//         Swal.fire({
//           icon: 'error',
//           title: 'Falha no Login',
//           text: 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.',
//           confirmButtonColor: '#c62828'
//         });
//       }
//     });
//   }

//   togglePasswordVisibility(): void {
//     this.hidePassword = !this.hidePassword;
//   }
// }

onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const credenciais: LoginRequest = this.loginForm.value;
  const email = credenciais.email;

  // 3. DECIDA QUAL API CHAMAR ANTES DE FAZER A REQUISIÇÃO
  if (email.endsWith('@bankflow.com')) {
    // É um funcionário, chame o FuncionarioService
    this.funcionarioService.login(credenciais).subscribe({
      next: (response) => {
        console.log('Resposta do login de funcionário:', response);
        localStorage.setItem('jwt_token', response.token); 
        localStorage.setItem('isLoggedIn', 'true');
        Swal.fire({
          icon: 'success', title: 'Login Realizado!', timer: 1500, showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/menu-funcionario']);
        });
      },
      error: (err) => this.handleLoginError(err, 'funcionário')
    });

  } else {
    // É um cliente, chame o ClienteService
    this.clienteService.login(credenciais).subscribe({
      next: (response) => {
        console.log('Resposta do login de cliente:', response);
       // localStorage.setItem('jwt_token', response.token); 
        localStorage.setItem('isLoggedIn', 'true');
        Swal.fire({
          icon: 'success', title: 'Login Realizado!', timer: 1500, showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/menu-cliente']);
        });
      },
      error: (err) => this.handleLoginError(err, 'cliente')
    });
  }
}

// 4. (Opcional) Crie um método para não repetir o código de erro
private handleLoginError(err: any, userType: string): void {
  console.error(`Erro no login de ${userType}:`, err);
  Swal.fire({
    icon: 'error',
    title: 'Falha no Login',
    text: 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.',
    confirmButtonColor: '#c62828'
  });
}

togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;
}
}