import { Directive, TemplateRef, ViewContainerRef, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionsService } from '../../sessions/sessions.service';

@Directive({
    selector: '[auth]'
})

export class FeatureAllowDirective implements OnInit {

    allowedFeatureSubject = new BehaviorSubject([]);
    allowedFeature$ = this.allowedFeatureSubject.asObservable();
    allowedFeature: string[];

    constructor(
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainer: ViewContainerRef,
        protected sessionsService: SessionsService
    ) {
        this.allowedFeature$.subscribe(data => {
            this.allowedFeature = data
        });
    }

    @Input()
    set auth(val: string[]) {
        this.allowedFeatureSubject.next(val);
    }
    
    ngOnInit() {

        if (!this.allowedFeature) {
            this.viewContainer.clear();
            return;
        }

        if (!this.sessionsService.hasResource(this.allowedFeature)) {
            this.viewContainer.clear();
        } else {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
