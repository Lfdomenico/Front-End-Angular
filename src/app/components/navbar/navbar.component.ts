import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { ConfirmationModalComponent } from '../../components/confirmationmodal/confirmationmodal'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isDropdownOpen = false;
  userFirstName: string | null = null;
  userEmail: string | null = null;
  userPhoto: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef; 

  constructor(
    private router: Router,
    private modalService: NgbModal 
  ) {}

  ngOnInit(): void {
    const fullName = localStorage.getItem('userName');
    this.userFirstName = fullName ? fullName.split(' ')[0] : null;
    this.userEmail = localStorage.getItem('userEmail');
    this.userPhoto = localStorage.getItem('userPhoto');
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  confirmLogout(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });

    modalRef.componentInstance.title = 'Confirmação de Saída';
    modalRef.componentInstance.message = 'Tem certeza que deseja <strong>sair</strong> do BankFlow?'; 
    modalRef.componentInstance.confirmButtonText = 'Sim, sair';

    modalRef.result.then(
      (result) => {
        if (result === true) {
          console.log('User confirmed logout.');
          this.performLogout(); 
        } else {
          console.log('User canceled logout.');
        }
      },
      (reason) => {
        console.log(`Logout confirmation modal dismissed by: ${reason}.`);
      }
    );
  }

  private performLogout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
    console.log('Logout performed successfully.');
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        localStorage.setItem('userPhoto', base64);
        this.userPhoto = base64;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // navigateToMenu(): void {
  //   this.router.navigate(['/menu-cliente']);
  // }

  navigateToMenu(): void {
    const url = this.router.url;
  
    // Se estiver em qualquer rota que comece com '/menu-funcionario'
    if (url.startsWith('/menu-funcionario')) {
      this.router.navigate(['/menu-funcionario']);
    } else {
      // Para outras telas, segue para menu-cliente (ou outra rota desejada)
      this.router.navigate(['/menu-cliente']);
    }
  }
}