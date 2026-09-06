import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AccountBalance, CalculationAudit, Formula, GlobalVariable, Page, TaxCode, VariableMapping } from './models';

@Injectable({providedIn: 'root'})
export class ApiService {
  private http = inject(HttpClient);
  private base = '/api';

  list<T>(path: string, size = 100): Observable<Page<T>> {
    return this.http.get<Page<T>>(`${this.base}/${path}`, { params: new HttpParams().set('page', 0).set('size', size) });
  }
  get<T>(path: string): Observable<T> { return this.http.get<T>(`${this.base}/${path}`); }
  create<T>(path: string, body: unknown): Observable<T> { return this.http.post<T>(`${this.base}/${path}`, body); }
  update<T>(path: string, body: unknown): Observable<T> { return this.http.put<T>(`${this.base}/${path}`, body); }
  remove(path: string): Observable<void> { return this.http.delete<void>(`${this.base}/${path}`); }

  formulas = { list: () => this.list<Formula>('formulas'), create: (v: Formula) => this.create<Formula>('formulas', v), update: (id: number, v: Formula) => this.update<Formula>(`formulas/${id}`, v), remove: (id: number) => this.remove(`formulas/${id}`), byCodBc: (codBc: string) => this.get<Formula>(`formulas/search/findByCodBc?codBc=${encodeURIComponent(codBc)}`) };
  taxCodes = { list: () => this.list<TaxCode>('codigos-tributacao'), create: (v: TaxCode) => this.create<TaxCode>('codigos-tributacao', v), update: (id: string, v: TaxCode) => this.update<TaxCode>(`codigos-tributacao/${id}`, v), remove: (id: string) => this.remove(`codigos-tributacao/${id}`) };
  mappings = { list: () => this.list<VariableMapping>('variaveis-mapeamento'), create: (v: VariableMapping) => this.create<VariableMapping>('variaveis-mapeamento', v), update: (id: number, v: VariableMapping) => this.update<VariableMapping>(`variaveis-mapeamento/${id}`, v), remove: (id: number) => this.remove(`variaveis-mapeamento/${id}`) };
  globals = { list: () => this.list<GlobalVariable>('global-variables'), create: (v: GlobalVariable) => this.create<GlobalVariable>('global-variables', v), update: (id: number, v: GlobalVariable) => this.update<GlobalVariable>(`global-variables/${id}`, v), remove: (id: number) => this.remove(`global-variables/${id}`) };
  balances = { list: () => this.list<AccountBalance>('balancetes'), create: (v: AccountBalance) => this.create<AccountBalance>('balancetes', v), update: (id: number, v: AccountBalance) => this.update<AccountBalance>(`balancetes/${id}`, v), remove: (id: number) => this.remove(`balancetes/${id}`) };
  audits = { list: () => this.list<CalculationAudit>('calculationAudits'), all: () => this.get<CalculationAudit[]>('calculo/auditoria') };
  association<T>(path: string, id: string | number, property: string): Observable<T> {
    return this.http.get<T>(`${this.base}/${path}/${id}/${property}`);
  }

  setAssociation(path: string, id: string | number, property: string, targetPath: string, targetId: string | number): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'text/uri-list' });
    const uri = `${location.origin.replace(/:4200$/, ':8080')}${this.base}/${targetPath}/${targetId}`;
    return this.http.put(`${this.base}/${path}/${id}/${property}`, uri, { headers, responseType: 'text' as const });
  }

  clearAssociation(path: string, id: string | number, property: string): Observable<unknown> {
    return this.http.delete<void>(`${this.base}/${path}/${id}/${property}`);
  }

  calculate(codBc: string) { return this.http.post<CalculationAudit>(`${this.base}/calculo/${encodeURIComponent(codBc)}`, null); }
}
