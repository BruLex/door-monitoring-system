import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, of, of as observableOf } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { ApiResponse, ConfirmDialogConfig, RootComponentInterface } from 'src/app/types';

import { ConfirmDialogComponent } from './utils/confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    static instance(): AppService {
        return this._instance;
    }
    private static rootComponent: RootComponentInterface;
    private static _instance: AppService;
    private title: string = '';

    constructor(private http: HttpClient, private matDialog: MatDialog, private snackBar: MatSnackBar) {
        AppService._instance = this;
    }

    setAppConfig(config: { title: string }): void {
        this.title = config.title;
    }

    getConfig(): { title: string } {
        return {
            title: this.title
        };
    }

    apiRequest(options: { url: string; body?: object }): Observable<ApiResponse> {
        return this.http.post(`http://127.0.0.1:3000/${options.url}`, options.body || {}).pipe(
            mergeMap((resp: Object): Observable<ApiResponse> => observableOf(new ApiResponse(resp))),
            catchError((error: any): Observable<ApiResponse> => of(new ApiResponse(error.error)))
        );
    }

    setupRootComponent(rootComponent: RootComponentInterface): void {
        AppService.rootComponent = rootComponent;
    }

    showLoadmask(): void {
        AppService.rootComponent?.showLoadmask();
    }

    hideLoadmask(): void {
        AppService.rootComponent?.hideLoadmask();
    }

    openSnackBar(message: string): void {
        this.snackBar.open(message, 'Ok', {
            duration: 4000
        });
    }

    openConfirmDialog(config: ConfirmDialogConfig): void {
        const dialogRef: MatDialogRef<ConfirmDialogComponent, any> = this.matDialog.open(ConfirmDialogComponent, {
            data: {
                message: config.message
            }
        });
        dialogRef.afterClosed().subscribe((result: any | undefined): void => {
            if (result) {
                config.onSuccess();
            }
            if (!result && !!config.onFail) {
                config.onFail();
            }
        });
    }
}
