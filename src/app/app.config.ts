import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled', // Habilita a rolagem para âncoras (#)
        scrollPositionRestoration: 'enabled' // Opcional, mas recomendado: restaura a posição da rolagem ao voltar/avançar no histórico
      })
    ),

    provideHttpClient(),
    importProvidersFrom(FormsModule)
    // provideBrowserGlobalErrorListeners(),
    // provideRouter(routes, { anchorScrolling: 'enabled' }),
    // // provideZoneChangeDetection({ eventCoalescing: true }),
    // provideRouter(routes),
    // provideHttpClient(), 
    // importProvidersFrom(FormsModule)
  ]
};