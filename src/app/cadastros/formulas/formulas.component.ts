import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Formula, GlobalVariable, VariableMapping, AccountBalance } from '../../core/models';
import { PageComponent } from '../../shared/page.component';

@Component({selector:'app-formulas',standalone:true,imports:[CommonModule,FormsModule,PageComponent],template:`
<app-page title="Fórmulas" subtitle="Defina a expressão SpEL que calcula cada base da Tabela 12." eyebrow="CADASTRO / TABELA 12">
<div class="builder card"><div class="builder-main"><div class="field"><label>Código da base de cálculo</label><input [(ngModel)]="draft.codBc" placeholder="Ex.: BC001"></div><div class="field"><label>Expressão SpEL</label><textarea [(ngModel)]="draft.expressaoSpel" rows="7" placeholder="Ex.: receitaTributavel - deducoes"></textarea></div><div class="toolbar"><button class="btn primary" (click)="save()">{{draft.id?'Atualizar':'Cadastrar fórmula'}}</button><button class="btn" (click)="calculate()" [disabled]="!draft.codBc">▶ Calcular</button><button class="btn ghost" (click)="newFormula()">Limpar</button></div><div class="tips"><b>Exemplos de expressão</b><code>receitaTributavel - deducoes</code><code>(receita * aliquota) / 100</code><code>saldoConta + valorGlobal</code></div></div><aside class="builder-side"><h3>Variáveis disponíveis</h3><p class="muted">Use os nomes cadastrados como variáveis do contexto da expressão.</p>@for(v of mappings; track v.id){<button class="token" (click)="insert(v.nomeVariavel)">{{v.nomeVariavel}}<small>{{v.operacao}}</small></button>} @for(g of globals; track g.name){<button class="token" (click)="insert(g.name)">{{g.name}}<small>{{g.value}}</small></button>} @if(!mappings.length && !globals.length){<span class="muted">Cadastre variáveis para aparecerem aqui.</span>}</aside></div>
<div class="card"><div class="table-head"><h2>Fórmulas cadastradas</h2><input class="search" [(ngModel)]="filter" placeholder="Filtrar por código"></div><table><thead><tr><th>Código</th><th>Expressão</th><th>Ações</th></tr></thead><tbody>@for(f of filtered(); track f.id){<tr><td><b>{{f.codBc}}</b></td><td><code>{{f.expressaoSpel}}</code></td><td class="actions"><button class="link" (click)="edit(f)">Editar</button><button class="link danger" (click)="remove(f)">Excluir</button><button class="link" (click)="run(f)">Calcular</button></td></tr>} @empty {<tr><td colspan="3" class="empty">Nenhuma fórmula cadastrada.</td></tr>}</tbody></table></div>
@if(result){<div class="card result-card"><div><span class="eyebrow">RESULTADO</span><h2>{{result.codBc}}</h2><p>{{result.jsonVariaveisEntrada}}</p></div><strong>{{result.valorResultado | number:'1.2-4'}}</strong></div>}
</app-page>`})
export class FormulasComponent {
private api=inject(ApiService);
    formulas:Formula[]=[];
    mappings:VariableMapping[]=[];
    globals:GlobalVariable[]=[];
    balances:AccountBalance[]=[];
    filter='';
    draft:Formula={codBc:'',expressaoSpel:''};
    result:any;

    constructor(){this.load();
        this.api.mappings.list().subscribe(x=>this.mappings=x._embedded?.['variaveisMapeamento']??[]);
        this.api.globals.list().subscribe(x=>this.globals=x._embedded?.['globalVariables']??[]);
        this.api.balances.list().subscribe(x=>this.balances=x._embedded?.['balancetes']??[]);
    }

    load(){
        this.api.formulas.list().subscribe(x=>this.formulas=x._embedded?.['formulas']??[])
    }
    
    filtered(){
        const q=this.filter.toLowerCase();
        return this.formulas.filter(f=>f.codBc.toLowerCase().includes(q)||f.expressaoSpel.toLowerCase().includes(q));
    }

    save(){
        const op=this.draft.id?this.api.formulas.update(this.draft.id,this.draft):this.api.formulas.create(this.draft);
        op.subscribe(()=>{
            this.load();
            this.newFormula();
        });
    }

    edit(f:Formula){
        this.draft={...f};
        window.scrollTo({top:0,behavior:'smooth'});
    }

    newFormula(){
        this.draft={codBc:'',expressaoSpel:''};
    }

    remove(f:Formula){
        if(f.id && confirm(`Excluir a fórmula ${f.codBc}?`)) this.api.formulas.remove(f.id).subscribe(()=>this.load());
    }

    insert(v:string){
        this.draft={...this.draft,expressaoSpel:this.draft.expressaoSpel+(this.draft.expressaoSpel?' ':'')+v};
    }

    calculate(){
        this.api.calculate(this.draft.codBc).subscribe(r=>this.result=r);
    }

    run(f:Formula){
        this.draft={...f};
        this.calculate();
    }
}
