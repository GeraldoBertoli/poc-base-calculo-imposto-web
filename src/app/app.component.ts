import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastService } from './core/toast.service';

@Component({
  selector:'app-root', 
  standalone:true, 
  imports:[RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html'})
export class AppComponent {
  toast = inject(ToastService);
}
