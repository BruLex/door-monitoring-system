import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[dkLoadmask]'
})
export class LoadmaskDirective {
    @HostBinding('class.dk-loadmask') isEnabled: boolean = false;
    @HostBinding('class.dk-loadmask-top') top: boolean = false;
    @HostBinding('attr.dk-loadmask-text') text: string = '';

    @Input() set dkLoadmask(status: boolean) {
        if (status === this.isEnabled) {
            return;
        }

        this.isEnabled = status;
    }

    @Input() set dkLoadmaskPosition(position: 'top' | 'bottom') {
        this.top = position === 'top';
    }

    @Input() set dkLoadmaskText(text: string) {
        this.text = text;
    }
}
