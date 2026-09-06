import { Component, Input } from '@angular/core';

@Component({
    selector:'app-page', 
    standalone:true, 
    templateUrl: './page.component.html'})
export class PageComponent { 
    @Input() title=''; 
    @Input() subtitle=''; 
    @Input() eyebrow='DeRE'; 
}
