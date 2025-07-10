import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  // showSobreDesc   = false;
  // showContatoDesc = false;

  // toggleSobre(): void {
  //   this.showSobreDesc   = !this.showSobreDesc;
  //   this.showContatoDesc = false;
  // }

  // toggleContato(): void {
  //   this.showContatoDesc = !this.showContatoDesc;
  //   this.showSobreDesc   = false;
  // }
}
