import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../core/api.service';
import { PageComponent } from '../shared/page.component';
import { CalculationAudit } from '../core/models';

@Component({selector:'app-dashboard',
    standalone:true,
    imports:[PageComponent,RouterLink,CommonModule],
    templateUrl: './dashboard.component.html',
    styles:[]})
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
