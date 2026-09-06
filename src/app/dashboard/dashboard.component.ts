import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../core/api.service';
import { PageComponent } from '../shared/page.component';
import { CalculationAudit } from '../core/models';

@Component({selector:'app-dashboard',standalone:true,imports:[PageComponent,RouterLink,CommonModule],template:`
<app-page title="Visão geral" subtitle="Configure as bases de cálculo da Tabela 12 e execute a PoC com Spring EL." eyebrow="DECLARAÇÃO DE REGIMES ESPECÍFICOS">
<div class="grid kpis"><div class="card kpi"><span>Fórmulas</span><b>{{counts.formulas}}</b><a routerLink="/formulas">Gerenciar →</a></div><div class="card kpi"><span>Balancetes</span><b>{{counts.balancetes}}</b><a routerLink="/balancetes">Gerenciar →</a></div><div class="card kpi"><span>Variáveis</span><b>{{counts.variaveis}}</b><a routerLink="/variaveis">Gerenciar →</a></div><div class="card kpi"><span>Códigos tributários</span><b>{{counts.codigos}}</b><a routerLink="/codigos-tributacao">Gerenciar →</a></div></div>
<div class="grid two"><div class="card hero-card"><div class="hero-icon">ƒx</div><h2>Editor de fórmula</h2><p>Cadastre o código da base de cálculo, escreva a expressão SpEL e teste a execução sem sair da tela.</p><a class="btn primary" routerLink="/formulas">Abrir editor</a></div><div class="card"><h2>Última execução</h2>@if (last) {<div class="result"><span>{{last.codBc}}</span><strong>{{last.valorResultado | number:'1.2-2'}}</strong></div><small>{{last.dtProcessamento | date:'dd/MM/yyyy HH:mm'}}</small>} @else {<p class="muted">Nenhuma execução registrada.</p>}</div></div>
<div class="card"><h2>Fluxo sugerido</h2><div class="flow"><span>1. Cadastros</span><i>→</i><span>2. Mapeamento</span><i>→</i><span>3. Fórmula SpEL</span><i>→</i><span>4. Calcular</span><i>→</i><span>5. Auditoria</span></div></div>
</app-page>`,styles:[]})
export class DashboardComponent { 
    private api=inject(ApiService);
    counts={formulas:0,balancetes:0,variaveis:0,codigos:0};
    last?: CalculationAudit;
    
    constructor(){ 
        forkJoin({
            f:this.api.formulas.list(),b:this.api.balances.list(),v:this.api.mappings.list(),c:this.api.taxCodes.list(),a:this.api.audits.all()
        }).subscribe(x=>{
            this.counts={formulas:x.f.page?.totalElements??x.f._embedded?.['formulas']?.length??0,balancetes:x.b.page?.totalElements??x.b._embedded?.['balancetes']?.length??0,variaveis:x.v.page?.totalElements??x.v._embedded?.['variaveisMapeamento']?.length??0,codigos:x.c.page?.totalElements??x.c._embedded?.['codigosTributacao']?.length??0};
            this.last=x.a.at(-1);
        });
    }
}
