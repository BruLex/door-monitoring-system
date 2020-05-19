import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, of as observableOf } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

import { ApiResponse, ConfirmDialogConfig, RootComponentInterface } from '@utils/types';

import { ConfirmDialogComponent } from './utils/confirm-dialog.component';

export interface AppConfig {
    title: string;
    showNavigation: boolean;
    username: string;
}
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
    private username: string = '';
    private showNavigation: boolean = true;

    constructor(private http: HttpClient, private matDialog: MatDialog, private snackBar: MatSnackBar) {
        AppService._instance = this;
    }

    setAppConfig(config: Partial<Omit<AppConfig, 'username'>>): void {
        this.title = config.title;
        this.showNavigation = config.showNavigation ?? true;
    }

    getConfig(): AppConfig {
        return {
            title: this.title,
            showNavigation: this.showNavigation,
            username: this.username || 'unknown'
        };
    }

    apiRequest(options: { url: string; body?: object }): Observable<ApiResponse> {
        return this.http
            .post(`http://127.0.0.1:3000/${options.url}`, options.body || {}, {
                withCredentials: true,
                observe: 'response'
            })
            .pipe(
                mergeMap((resp): Observable<ApiResponse> => observableOf(new ApiResponse(resp.body))),
                catchError((error): Observable<ApiResponse> => observableOf(new ApiResponse(error.error)))
            );
    }

    fetchUserData(): Observable<ApiResponse> {
        return this.apiRequest({ url: 'session/get_my_data' }).pipe(
            tap((resp) => {
                if (resp.isSuccess) {
                    this.username = resp.data.name;
                }
            })
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
