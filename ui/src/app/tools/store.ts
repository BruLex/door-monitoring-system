import { Type } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Model } from 'src/app/tools/model';
import { ApiResponse } from 'src/app/types';

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

export abstract class Store<T extends Model> {
    abstract schema: StoreSchema<T>;
    dataSource: MatTableDataSource<T> = new MatTableDataSource();

    get items(): T[] {
        return this.dataSource.data;
    }

    reload(additionalOptions?: any): Observable<ApiResponse> {
        if (!this.schema.listProxy) {
            return of(new ApiResponse({ status: 'error', data: {} }));
        }
        return AppService.instance()
            .apiRequest({
                url: this.schema.listProxy,
                body: { ...(this.schema.options || {}), ...additionalOptions }
            })
            .pipe(
                tap((response) => {
                    if (response.isSuccess) {
                        const rawData: object[] = response.data[this.schema.rootProperty];
                        const model: Type<T> = this.schema.model;
                        this.dataSource.data = rawData.map((data) => new model(data));
                    }
                })
            );
    }

    bulkDelete(...ids: number[]): Observable<ApiResponse[]> {
        if (ids.length === 0) {
            return;
        }
        const itemsToDelete: T[] = this.dataSource.data.filter((item) => ids.includes(item[this.schema.idProperty]));
        return combineLatest(itemsToDelete.map((item) => item.delete())).pipe(
            tap((responses) => {
                responses.forEach((response, index) => {
                    if (response.isSuccess) {
                        const rec = this.dataSource.data.splice(this.dataSource.data.indexOf(itemsToDelete[index]), 1);
                        console.log(rec);
                    }
                });
            })
        );
    }
}
