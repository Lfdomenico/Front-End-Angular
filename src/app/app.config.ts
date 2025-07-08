// Caminho: src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

// **PASSO 1: IMPORTE a função 'provideHttpClient'**
import { provideHttpClient } from '@angular/common/http'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // **PASSO 2: ADICIONE a função aqui no array de providers**
    provideHttpClient() 
  ]
};