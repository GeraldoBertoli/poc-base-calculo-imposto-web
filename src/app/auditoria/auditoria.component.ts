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
    templateUrl:'./auditoria.component.html'}) 
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

