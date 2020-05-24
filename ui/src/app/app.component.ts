import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { creatValidators } from '@utils';
import { RootComponentInterface } from '@utils/types';

import { AppService } from './app.service';

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

    readonly changePasswordFormGroup: FormGroup = new FormGroup({
        old_password: new FormControl(creatValidators({ type: 'str', required: true })),
        new_password: new FormControl(creatValidators({ type: 'str', required: true }))
    });
    hintError: string = '';

    changePasswordObj: { old_password: string; new_password: string } = { old_password: '', new_password: '' };

    @ViewChild('globalLoading', { static: true }) globalLoadingRef: CdkPortal;

    get title(): string {
        return this.appService.getConfig().title;
    }

    get username(): string {
        return this.appService.getConfig().username;
    }

    get showNavigation(): boolean {
        return this.appService.getConfig().showNavigation;
    }
    private overlayRef: OverlayRef;
    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private matDialog: MatDialog,
        private router: Router,
        private overlay: Overlay
    ) {
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

    makeLogout(): void {
        this.showLoadmask();
        this.appService.apiRequest({ url: 'session/logout' }).subscribe(() => {
            this.hideLoadmask();
            this.router.navigate(['login']);
        });
    }

    changePassword(): void {
        this.showLoadmask();
        this.appService.apiRequest({ url: 'session/change_password', body: this.changePasswordObj }).subscribe(resp => {
            this.hideLoadmask();
            if (resp.isSuccess) {
                this.matDialog.closeAll();
            } else {
                this.hintError = resp.message || 'Internal server error';
            }
        });
    }

    openChangePasswordDlg(dialog: TemplateRef<ElementRef>): void {
        this.subs.push(
            this.matDialog
                .open(dialog, { width: '500px' })
                .afterClosed()
                .subscribe(() => {
                    this.changePasswordObj = { old_password: '', new_password: '' };
                    this.changePasswordFormGroup.reset();
                })
        );
    }
}
