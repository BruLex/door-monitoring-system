import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { AppService } from './app.service';
import { RootComponentInterface } from './types';

interface NavItem {
    link: string;
    name: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements RootComponentInterface {
    readonly navItems: NavItem[] = [
        { link: '/dashboard', name: 'Dashboard' },
        { link: '/devices', name: 'Devices' },
        { link: '/roles', name: 'Roles' },
        { link: '/cards', name: 'Cards' },
        { link: '/system_logs', name: 'System logs' }
    ];

    @ViewChild('globalLoading', { static: true }) globalLoadingRef: CdkPortal;

    get title(): string {
        return this.appService.getConfig().title;
    }
    private overlayRef: OverlayRef;

    constructor(private appService: AppService, private overlay: Overlay) {
        this.appService.setupRootComponent(this);
    }

    showLoadmask(): void {
        if (!this.overlayRef?.hasAttached()) {
            this.overlayRef = this.overlay.create({ hasBackdrop: true, backdropClass: 'load-backdrop' });
            this.overlayRef.attach(this.globalLoadingRef);
        }
    }

    hideLoadmask(): void {
        if (this.overlayRef?.hasAttached()) {
            this.overlayRef.dispose();
        }
    }
}
