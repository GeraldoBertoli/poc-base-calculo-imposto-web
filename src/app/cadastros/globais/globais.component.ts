import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { GlobalVariable } from '../../core/models';
import { PageComponent } from '../../shared/page.component';

@Component({selector:'app-globais',standalone:true,imports:[CommonModule,FormsModule,PageComponent],template:`<app-page title="Variáveis globais" subtitle="Valores numéricos reutilizados por fórmulas SpEL." eyebrow="CADASTROS"><div class="card form-card"><div class="field"><label>Nome</label><input [(ngModel)]="draft.name" placeholder="Ex.: aliquotaPadrao"></div><div class="field"><label>Valor</label><input type="number" [(ngModel)]="draft.value"></div><button class="btn primary" (click)="save()">{{editing?'Atualizar':'Cadastrar'}}</button><button class="btn ghost" (click)="reset()">Limpar</button></div><div class="card"><table><thead><tr><th>Nome</th><th>Valor</th><th>Ações</th></tr></thead><tbody>@for(x of items;track x.id){<tr><td><code>{{x.name}}</code></td><td>{{x.value | number:'1.2-4'}}</td><td class="actions"><button class="link" (click)="edit(x)">Editar</button><button class="link danger" (click)="remove(x)">Excluir</button></td></tr>}@empty{<tr><td colspan="3" class="empty">Nenhum registro.</td></tr>}</tbody></table></div></app-page>`})
export class GlobaisComponent {
    api=inject(ApiService);
    items:GlobalVariable[]=[];
    draft:GlobalVariable={name:'',value:0};
    editing=false;

    constructor(){
        this.load()
    }
    
    load(){
        this.api.globals.list().subscribe(x=>this.items=x._embedded?.['globalVariables']??[])
    }

    save(){
        let o=this.editing && this.draft.id ? this.api.globals.update(this.draft.id,this.draft): this.api.globals.create(this.draft);
        o.subscribe(()=>{this.reset();this.load()})
    }
    
    edit(x:GlobalVariable){
        this.draft={...x};
        this.editing=true
    }
    
    reset(){
        this.draft={name:'',value:0};
        this.editing=false
    }
    
    remove(x:GlobalVariable){
        if(x.id&&confirm(`Excluir ${x.name}?`))
            this.api.globals.remove(x.id).subscribe(()=>this.load())
    }
}
