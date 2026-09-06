import { Injectable, signal } from '@angular/core';
@Injectable({providedIn: 'root'})
export class ToastService {
  message = signal('');
  show(value: string) { this.message.set(value); setTimeout(() => this.message.set(''), 3500); }
}
