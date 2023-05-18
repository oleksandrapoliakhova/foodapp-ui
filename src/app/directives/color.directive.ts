import {Directive, HostBinding, HostListener} from '@angular/core';
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

@Directive({
  selector: '[clickColor]'
})
export class ColorDirective {

  click = 0;
  private toggle: boolean = false;

  constructor(private doms: DomSanitizer) {
  }

  @HostBinding('style') get myStyle(): SafeStyle {
    let style: string = this.toggle ? ` box-shadow: 5px 5px 5px black;` : '';
    return this.doms.bypassSecurityTrustStyle(style);
  }

  @HostListener('click') onClick() {
    this.click++;
    if (this.click <= 1) {
      this.toggle = !this.toggle;
    }
  }

}
