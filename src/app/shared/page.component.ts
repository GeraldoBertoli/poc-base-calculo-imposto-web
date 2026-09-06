import { Component, Input } from '@angular/core';

@Component({selector:'app-page', standalone:true, template:`<section class="page"><div class="page-head"><div><div class="eyebrow">{{eyebrow}}</div><h1>{{title}}</h1><p>{{subtitle}}</p></div><ng-content select="[actions]"></ng-content></div><ng-content></ng-content></section>`})
export class PageComponent { 
    @Input() title=''; 
    @Input() subtitle=''; 
    @Input() eyebrow='DeRE'; 
}
