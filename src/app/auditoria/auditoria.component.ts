import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { CalculationAudit } from '../core/models';
import { PageComponent } from '../shared/page.component';

@Component({
    selector:'app-auditoria',
    standalone:true,
    imports:[CommonModule,FormsModule,PageComponent],
    template:`<app-page title="Auditoria de cálculos" subtitle="Histórico retornado pela PoC de execução das bases de cálculo." eyebrow="EXECUÇÃO"><div class="card execute"><div class="field"><label>Código da base</label><input [(ngModel)]="codBc" placeholder="Ex.: BC001"></div><button class="btn primary" (click)="calculate()" [disabled]="!codBc">▶ Calcular agora</button><span class="muted">A API executa <code>POST /api/calculo/&#123;codBc&#125;</code>.</span></div><div class="card"><div class="table-head"><h2>Execuções</h2><button class="btn" (click)="load()">Atualizar</button></div><table><thead><tr><th>Data</th><th>Base</th><th>Resultado</th><th>Entrada</th></tr></thead><tbody>@for(x of items;track x.id){<tr><td>{{x.dtProcessamento | date:'dd/MM/yyyy HH:mm:ss'}}</td><td><b>{{x.codBc}}</b></td><td class="number">{{x.valorResultado | number:'1.2-4'}}</td><td><code>{{x.jsonVariaveisEntrada}}</code></td></tr>}@empty{<tr><td colspan="4" class="empty">Nenhuma execução registrada.</td></tr>}</tbody></table></div></app-page>`}) 
export class AuditoriaComponent {
    api=inject(ApiService);
    items:CalculationAudit[]=[];
    codBc='';
    constructor(){
        this.load()
    }
    load(){
        this.api.audits.all().subscribe(x=>this.items=x)
    }
    calculate(){
        this.api.calculate(this.codBc).subscribe(x=>{this.items=[...this.items,x]})
    }
}

