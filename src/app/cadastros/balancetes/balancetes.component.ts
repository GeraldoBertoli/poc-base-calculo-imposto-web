import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { AccountBalance, TaxCode } from '../../core/models';
import { PageComponent } from '../../shared/page.component';

@Component({
  selector: 'app-balancetes',
  standalone: true,
  imports: [CommonModule, FormsModule, PageComponent],
  templateUrl: './balancetes.component.html' 
})
export class BalancetesComponent {
  api = inject(ApiService);
  items: AccountBalance[] = [];
  taxes: TaxCode[] = [];
  draft: AccountBalance = { conta: '', saldo: 0, codTrib: '' };
  editing = false;
  filter = '';

  constructor() {
    this.api.taxCodes.list().subscribe(x => this.taxes = x._embedded?.['codigosTributacao'] ?? []);
    this.load();
  }

  load() {
    this.api.balances.list().subscribe(x => {
      const items = x._embedded?.['balancetes'] ?? [];
      if (!items.length) { this.items = []; return; }
      forkJoin(items.map(item => item.id
        ? this.api.association<TaxCode>('balancetes', item.id, 'codTrib').pipe(
            map(t => ({ ...item, codTrib: t.codigo })),
            catchError(() => of(item))
          )
        : of(item)
      )).subscribe(enriched => this.items = enriched);
    });
  }

  filtered() {
    const q = this.filter.toLowerCase();
    return this.items.filter(x => x.conta.toLowerCase().includes(q) || (x.codTrib ?? '').toLowerCase().includes(q));
  }

  save() {
    const payload: AccountBalance = { conta: this.draft.conta, saldo: this.draft.saldo };
    const request = this.editing && this.draft.id
      ? this.api.balances.update(this.draft.id, payload).pipe(map(() => this.draft.id!))
      : this.api.balances.create(payload).pipe(map((saved: AccountBalance) => saved.id!));

    request.subscribe(id => {
      const association = this.draft.codTrib
        ? this.api.setAssociation('balancetes', id, 'codTrib', 'codigos-tributacao', this.draft.codTrib)
        : this.api.clearAssociation('balancetes', id, 'codTrib');

      association.subscribe({
        next: () => { this.reset(); this.load(); },
        error: () => { this.reset(); this.load(); }
      });
    });
  }

  edit(x: AccountBalance) { this.draft = { ...x }; this.editing = true; }
  reset() { this.draft = { conta: '', saldo: 0, codTrib: '' }; this.editing = false; }
  remove(x: AccountBalance) {
    if (x.id && confirm(`Excluir conta ${x.conta}?`)) this.api.balances.remove(x.id).subscribe(() => this.load());
  }
}
