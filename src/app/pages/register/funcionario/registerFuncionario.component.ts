import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FuncionarioService, FuncionarioRequest, FuncionarioResponse } from '../../../services/funcionario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-funcionario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './registerFuncionario.component.html',
  styleUrls: ['./registerFuncionario.component.scss']
})
export class RegisterFuncionarioComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  hideRegisterPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, this.cpfInvalidoValidator]],
      senha: ['', Validators.required]
    });
    document.body.classList.add('menu-funcionario-bg');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('menu-funcionario-bg');
  }

  cpfInvalidoValidator(ctrl: AbstractControl): ValidationErrors | null {
    const raw = (ctrl.value || '').replace(/\D/g, '');
    return raw.length === 11 ? null : { cpfInvalido: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const dto: FuncionarioRequest = this.registerForm.value;
    this.funcionarioService.cadastrar(dto).subscribe({
      next: (res: FuncionarioResponse) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Cadastro Realizado!',
          text: `Funcionário ${res.nome} cadastrado com sucesso!`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => this.router.navigate(['/menu-funcionario']));
      },
      error: (err: any) => {
        this.isLoading = false;
        const msg =
          err.status === 409
            ? err.error
            : 'Ocorreu uma falha no servidor. Tente novamente mais tarde.';
        Swal.fire({
          icon: 'error',
          title: 'Falha no Cadastro',
          text: msg,
          confirmButtonColor: '#c62828'
        });
      }
    });
  }
}
