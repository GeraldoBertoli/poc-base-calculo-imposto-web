import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { TaxCode } from '../../core/models';
import { PageComponent } from '../../shared/page.component';

@Component({selector:'app-codigos',
    standalone:true,
    imports:[CommonModule,
    FormsModule,
    PageComponent],
    template:`<app-page title="Códigos de tributação" subtitle="Cadastre os códigos usados para classificar contas e variáveis." eyebrow="CADASTROS"><div class="card form-card"><div class="field"><label>Código</label><input [(ngModel)]="draft.codigo" placeholder="Código"></div><div class="field wide"><label>Descrição</label><input [(ngModel)]="draft.descricao" placeholder="Descrição"></div><button class="btn primary" (click)="save()">{{editing?'Atualizar':'Cadastrar'}}</button><button class="btn ghost" (click)="reset()">Limpar</button></div><div class="card"><div class="table-head"><h2>Códigos</h2><input class="search" [(ngModel)]="filter" placeholder="Pesquisar"></div><table><thead><tr><th>Código</th><th>Descrição</th><th>Ações</th></tr></thead><tbody>@for(x of filtered();track x.codigo){<tr><td><b>{{x.codigo}}</b></td><td>{{x.descricao}}</td><td class="actions"><button class="link" (click)="edit(x)">Editar</button><button class="link danger" (click)="remove(x)">Excluir</button></td></tr>}@empty{<tr><td colspan="3" class="empty">Nenhum registro.</td></tr>}</tbody></table></div></app-page>`})
export class CodigosTributacaoComponent {
    api=inject(ApiService);
    items:TaxCode[]=[];
    draft:TaxCode={codigo:'',descricao:''};
    editing=false;
    filter='';
    
    constructor(){this.load()}
    
    load(){
        this.api.taxCodes.list().subscribe(x=>this.items=x._embedded?.['codigosTributacao']??[])
    }
    
    filtered(){
        let q=this.filter.toLowerCase();
        return this.items.filter(x=>x.codigo.toLowerCase().includes(q)||x.descricao.toLowerCase().includes(q))
    }
    
    save(){
        if(this.editing)
            this.api.taxCodes.update(this.draft.codigo,this.draft).subscribe(()=>{this.reset();this.load()});
        else 
            this.api.taxCodes.create(this.draft).subscribe(()=>{this.reset();this.load()})
    }
    
    edit(x:TaxCode){
        this.draft={...x};
        this.editing=true
    }
    
    reset(){
        this.draft={codigo:'',descricao:''};
        this.editing=false
    }
    
    remove(x:TaxCode){
        if(confirm(`Excluir ${x.codigo}?`))
            this.api.taxCodes.remove(x.codigo).subscribe(()=>this.load())
    }
}
