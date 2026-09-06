import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormulasComponent } from './cadastros/formulas/formulas.component';
import { BalancetesComponent } from './cadastros/balancetes/balancetes.component';
import { CodigosTributacaoComponent } from './cadastros/codigos-tributacao/codigos-tributacao.component';
import { VariaveisComponent } from './cadastros/variaveis/variaveis.component';
import { GlobaisComponent } from './cadastros/globais/globais.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'formulas', component: FormulasComponent },
  { path: 'balancetes', component: BalancetesComponent },
  { path: 'codigos-tributacao', component: CodigosTributacaoComponent },
  { path: 'variaveis', component: VariaveisComponent },
  { path: 'globais', component: GlobaisComponent },
  { path: 'auditoria', component: AuditoriaComponent },
  { path: '**', redirectTo: '' }
];
