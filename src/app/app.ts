// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App {
//   protected title = 'Projeto----a';
// }

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // <-- ADICIONE ESTA LINHA
  imports: [RouterOutlet],
  templateUrl: './app.component.html', // Corrigido para o padrão
  styleUrls: ['./app.component.scss']  // Corrigido para o padrão
})
export class AppComponent { // Nome da classe corrigido para o padrão
  title = 'Projeto----a';
}