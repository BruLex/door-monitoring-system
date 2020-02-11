import { HttpClient } from '@angular/common/http';
import { Component, Injectable, TemplateRef } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RootComponentInterface } from './types';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "./tools/confirm-dialog.component";

enum Statuses {
    Success = 'success',
    Error = 'error',
}

class Response {
    status: Statuses;
    // tslint:disable-next-line:no-any
    data?: any;
    message?: string;

    constructor(data: object) {
        Object.keys(data).forEach(key => (this[key] = data[key]));
    }

    get isSuccess() {
        return this.status === Statuses.Success;
    }
}

interface ConfirmDialogConfig {
    message: string;
    onSuccess: () => void;
    onFail?: () => void;
}

@Injectable({
    providedIn: 'root',
})
export class AppService {
    private title = '';

    private static rootComponent: RootComponentInterface;

    constructor(private http: HttpClient, private matDialog: MatDialog) {}

    setAppConfig(config: { title: string }) {
        this.title = config.title;
    }

    getConfig() {
        return {
            title: this.title,
        };
    }

    apiRequest(service: string, method: string, body: object = {}): Observable<Response> {
        return this.http
            .post<Response>(`http://127.0.0.1:3000/api/${service}/${method}`, body)
            .pipe(mergeMap(resp => observableOf(new Response(resp))));
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
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                config.onSuccess();
            }
            if (!result && !!config.onFail ) {
                config.onFail();
            }
        });
    }
}
