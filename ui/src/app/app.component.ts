import { ChangeDetectionStrategy, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { CdkPortal } from "@angular/cdk/portal";
import { RootComponentInterface } from "./types";

interface NavItem {
    link: string;
    name: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements RootComponentInterface {
    readonly navItems: NavItem[] = [
        { link: '/dashboard', name: 'Dashboard' },
        { link: '/permissions', name: 'Permissions' },
        { link: '/groups', name: 'Groups' },
        { link: '/users', name: 'Users' },
        { link: '/doors', name: 'Doors' },
        { link: '/test-table', name: 'Test table' },
        { link: '/system_logs', name: 'System logs' }
    ];

    private overlayRef: OverlayRef;

    get title() {
        return this.appService.getConfig().title;
    }

    @ViewChild('globalLoading', {static: true}) globalLoadingRef: CdkPortal;

    constructor(private appService: AppService, private overlay: Overlay) {
        this.appService.setupRootComponent(this);
    }

    showLoadmask(): void {
        if (!this.overlayRef?.hasAttached()) {
            this.overlayRef = this.overlay.create({ hasBackdrop: true , backdropClass: 'load-backdrop'});
            this.overlayRef.attach(this.globalLoadingRef);
        }
    }

    hideLoadmask(): void {
        if (this.overlayRef?.hasAttached()) {
            this.overlayRef.dispose();
        }
    }

}
