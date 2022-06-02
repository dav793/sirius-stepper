import {
  Directive,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[sirius-title]'
})
export class SiriusTitleDirective implements OnInit, OnDestroy {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }

  ngOnInit(): void {
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

}
