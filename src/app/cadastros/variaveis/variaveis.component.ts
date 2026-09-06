import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { VariableMapping, TaxCode } from '../../core/models';
import { PageComponent } from '../../shared/page.component';

@Component({
  selector: 'app-variaveis',
  standalone: true,
  imports: [CommonModule, FormsModule, PageComponent],
  templateUrl: './variaveis.component.html' 
})
export class VariaveisComponent {
  api = inject(ApiService);
  items: VariableMapping[] = [];
  taxes: TaxCode[] = [];
  draft: VariableMapping = { nomeVariavel: '', operacao: '', codTrib: '' };
  editing = false;

  constructor() {
    this.api.taxCodes.list().subscribe(x => this.taxes = x._embedded?.['codigosTributacao'] ?? []);
    this.load();
  }

  load() {
    this.api.mappings.list().subscribe(x => {
      const items = x._embedded?.['variaveisMapeamento'] ?? [];
      if (!items.length) { this.items = []; return; }
      forkJoin(items.map(item => item.id
        ? this.api.association<TaxCode>('variaveis-mapeamento', item.id, 'codTrib').pipe(
            map(t => ({ ...item, codTrib: t.codigo })),
            catchError(() => of(item))
          )
        : of(item)
      )).subscribe(enriched => this.items = enriched);
    });
  }

  save() {
    const payload: VariableMapping = {
      nomeVariavel: this.draft.nomeVariavel,
      operacao: this.draft.operacao,
      codTrib: ''
    };

    const request = this.editing && this.draft.id
      ? this.api.mappings.update(this.draft.id, payload).pipe(map(() => this.draft.id!))
      : this.api.mappings.create(payload).pipe(map((saved: VariableMapping) => saved.id!));

    request.subscribe(id => {
      const association = this.draft.codTrib
        ? this.api.setAssociation('variaveis-mapeamento', id, 'codTrib', 'codigos-tributacao', this.draft.codTrib)
        : this.api.clearAssociation('variaveis-mapeamento', id, 'codTrib');

      association.subscribe({
        next: () => { this.reset(); this.load(); },
        error: () => { this.reset(); this.load(); }
      });
    });
  }

  edit(x: VariableMapping) { this.draft = { ...x }; this.editing = true; }
  reset() { this.draft = { nomeVariavel: '', operacao: '', codTrib: '' }; this.editing = false; }
  remove(x: VariableMapping) {
    if (x.id && confirm(`Excluir ${x.nomeVariavel}?`)) this.api.mappings.remove(x.id).subscribe(() => this.load());
  }
}
