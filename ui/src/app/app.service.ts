import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of as observableOf } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ApiResponse, ConfirmDialogConfig, RootComponentInterface } from 'src/app/types';
import { ConfirmDialogComponent } from './tools/confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private static rootComponent: RootComponentInterface;
    private static _instance: AppService;

    static instance(): AppService {
        return this._instance;
    }

    private title = '';

    constructor(private http: HttpClient, private matDialog: MatDialog) {
        AppService._instance = this;
    }

    setAppConfig(config: { title: string }) {
        this.title = config.title;
    }

    getConfig() {
        return {
            title: this.title
        };
    }

    apiRequest(options: { url: string; body?: object }): Observable<ApiResponse> {
        return this.http
            .post(`http://127.0.0.1:3000/${options.url}`, options.body || {})
            .pipe(mergeMap((resp) => observableOf(new ApiResponse(resp))));
    }

    setupRootComponent(rootComponent: RootComponentInterface) {
        AppService.rootComponent = rootComponent;
    }

    showLoadmask(): void {
        AppService.rootComponent?.showLoadmask();
    }

    hideLoadmask(): void {
        AppService.rootComponent?.hideLoadmask();
    }

    openConfirmDialog(config: ConfirmDialogConfig) {
        const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
            data: {
                message: config.message
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                config.onSuccess();
            }
            if (!result && !!config.onFail) {
                config.onFail();
            }
        });
    }
}
