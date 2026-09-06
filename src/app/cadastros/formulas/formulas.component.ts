import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Formula, GlobalVariable, VariableMapping, AccountBalance } from '../../core/models';
import { PageComponent } from '../../shared/page.component';

@Component({
    selector:'app-formulas',
    standalone:true,
    imports:[CommonModule,FormsModule,PageComponent],
    templateUrl: './formulas.component.html'})
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
