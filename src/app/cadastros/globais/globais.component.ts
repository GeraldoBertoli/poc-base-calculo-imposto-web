import { CommonModule } from '@angular/common';
import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { GlobalVariable } from '../../core/models';
import { PageComponent } from '../../shared/page.component';

@Component({selector:'app-globais',
    standalone:true,
    imports:[CommonModule,FormsModule,PageComponent],
    templateUrl: './globais.component.html'})
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
