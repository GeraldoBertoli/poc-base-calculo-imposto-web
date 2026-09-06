import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastService } from './core/toast.service';

@Component({selector:'app-root', standalone:true, imports:[RouterOutlet, RouterLink, RouterLinkActive], template:`
<div class="shell">
  <aside class="sidebar">
    <div class="brand"><span class="brand-mark">D</span><div><b>DeRE</b><small>Base de Cálculo</small></div></div>
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Visão geral</a>
      <div class="nav-label">Cadastros</div>
      <a routerLink="/formulas" routerLinkActive="active">Fórmulas</a>
      <a routerLink="/balancetes" routerLinkActive="active">Balancetes</a>
      <a routerLink="/codigos-tributacao" routerLinkActive="active">Códigos de tributação</a>
      <a routerLink="/variaveis" routerLinkActive="active">Variáveis de mapeamento</a>
      <a routerLink="/globais" routerLinkActive="active">Variáveis globais</a>
      <div class="nav-label">Execução</div>
      <a routerLink="/auditoria" routerLinkActive="active">Auditoria</a>
    </nav>
    <div class="api-indicator"><span class="dot"></span> API localhost:8080</div>
  </aside>
  <main><router-outlet /></main>
</div>
@if (toast.message()) { <div class="toast">{{ toast.message() }}</div> }
`})
export class AppComponent { toast = inject(ToastService); }
