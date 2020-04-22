import { Type } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { AppService } from 'src/app/app.service';
import { ApiResponse } from 'src/app/types';
import { Model } from 'src/app/utils/model';

export interface StoreSchema<T extends Model> {
    /**
     * Instance of model
     */
    model: Type<T>;
    /**
     * Url to get list method
     */
    listProxy: string;
    /**
     * Property which identify id
     */
    idProperty?: string;
    /**
     * Root property with records
     */
    rootProperty: string;
    /**
     * Params which always added to api
     */
    options?: { [key: string]: any };
}

interface DefaultActionOptions {
    showLoadmask?: boolean;
    showResultNotification?: boolean;
}

const defaultActionOptions: DefaultActionOptions = { showLoadmask: true, showResultNotification: true };

export abstract class Store<T extends Model> {
    abstract schema: StoreSchema<T>;
    readonly loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    readonly onLoad: Subject<ApiResponse> = new Subject();

    dataSource: MatTableDataSource<T> = new MatTableDataSource();

    get items(): T[] {
        return this.dataSource.data;
    }
    private lastLoadParams: object;

    reload(additionalParams?: any): this {
        if (!this.schema.listProxy) {
            return this;
        }
        this.loading.next(true);
        if (additionalParams || !this.lastLoadParams) {
            this.lastLoadParams = { ...(this.schema.options || {}), ...(additionalParams || {}) };
        }
        AppService.instance()
            .apiRequest({
                url: this.schema.listProxy,
                body: this.lastLoadParams
            })
            .pipe(
                tap((response: ApiResponse): void => {
                    if (response.isSuccess) {
                        const rawData: object[] = response.data[this.schema.rootProperty];
                        const model: Type<T> = this.schema.model;
                        this.dataSource.data = rawData.map((data: Object): T => new model(data));
                    }
                    this.onLoad.next(response);
                }),
                finalize((): void => this.loading.next(false))
            )
            .subscribe();
        return this;
    }

    bulkDelete(ids: number[], options: DefaultActionOptions = defaultActionOptions): Observable<ApiResponse[]> {
        if (ids.length === 0) {
            return;
        }
        const { showLoadmask, showResultNotification }: DefaultActionOptions = options;
        const { idProperty }: StoreSchema<T> = this.schema;
        if (showLoadmask) {
            AppService.instance().showLoadmask();
        }
        const itemsToDelete: T[] = this.dataSource.data.filter((item: T): boolean => ids.includes(item[idProperty]));

        return combineLatest(
            itemsToDelete.map(
                (item: T): Observable<ApiResponse> =>
                    item.delete({ showLoadmask: false, showResultNotification: false })
            )
        ).pipe(
            tap(responses => {
                const failedResponses: ApiResponse[] = responses.filter(
                    (resp: ApiResponse): boolean => !resp.isSuccess
                );
                if (showResultNotification) {
                    AppService.instance().openSnackBar(
                        !failedResponses.length
                            ? 'All selected entities deleted successfully'
                            : `An error ocure will deleting next entities: [${failedResponses
                                  .map((item: ApiResponse): any => item[idProperty])
                                  .join(',')}], with error: ${failedResponses[0]?.message || 'Internal error'}`
                    );
                }
                responses.forEach((response: ApiResponse, index: number): void => {
                    if (response.isSuccess) {
                        this.dataSource.data.splice(this.dataSource.data.indexOf(itemsToDelete[index]), 1);
                    }
                });
            }),
            finalize((): void => {
                if (showLoadmask) {
                    AppService.instance().hideLoadmask();
                }
            })
        );
    }
}
