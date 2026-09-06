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
    templateUrl: './codigos-tributacao.component.html'})
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
