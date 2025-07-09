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
  nome: string | null = null;
  userEmail: string | null = null;
  userPhoto: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nome = localStorage.getItem('nome');
    this.userEmail = localStorage.getItem('userEmail');
    this.userPhoto = localStorage.getItem('userPhoto');
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  onPhotoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        localStorage.setItem('userPhoto', base64Image);
        this.userPhoto = base64Image;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }
}
