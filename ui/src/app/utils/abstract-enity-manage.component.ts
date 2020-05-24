import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { reverse, sortBy } from 'lodash';

import { Model } from '@utils/models/model';
import { Store } from '@utils/stores/store';

import { AppService } from '../app.service';
import { ApiResponse } from './types';

export abstract class AbstractEnityManageComponent<S extends Model, T extends Store<S>>
    implements OnDestroy, OnInit, AfterViewInit {
    abstract sort: MatSort;
    store: T;

    manageEntityDialogRef: TemplateRef<ElementRef>;
    currentModel: S;
    dialogEditMode: boolean;
    selection: SelectionModel<S> = new SelectionModel<S>(true, []);

    subs: Subscription[] = [];

    protected constructor(
        private mainKey: string,
        protected matDialog?: MatDialog,
        protected cdRef?: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.store.reload().onLoad.subscribe((resp: ApiResponse): void => {
            console.log('Reloaded');
            if (!resp.isSuccess) {
                AppService.instance().openSnackBar(resp?.message || 'Internal error');
            }
        });
    }

    ngAfterViewInit(): void {
        this.initSort();
    }

    ngOnDestroy(): void {
        this.subs.forEach((sub: Subscription): void => sub && sub.unsubscribe());
    }

    isAllSelected(): boolean {
        const numSelected: number = this.selection.selected.length;
        const numRows: number = this.store.dataSource.data?.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.store.dataSource.data.forEach((row: S): void => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: S): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row[this.mainKey]}`;
    }

    openDialog(mode: 'edit' | 'add', model?: S): void {
        this.currentModel = model || new this.store.schema.model();
        console.log(this.currentModel);
        this.dialogEditMode = mode === 'edit';
        this.subs.push(
            this.matDialog
                .open(this.manageEntityDialogRef, { width: '500px' })
                .afterClosed()
                .pipe(filter(value => !!value))
                .subscribe((): void => {
                    const observableResp: Observable<ApiResponse> = this.dialogEditMode
                        ? this.currentModel.update()
                        : this.currentModel.add();
                    observableResp.subscribe((response: ApiResponse): void => {
                        if (!this.dialogEditMode && response.isSuccess) {
                            this.store.dataSource.data = [this.currentModel, ...this.store.dataSource.data];
                            this.cdRef.detectChanges();
                            this.cdRef.markForCheck();
                        }
                    });
                })
        );
    }

    deleteModels(): void {
        const devices: number[] = this.selection.selected.map(model => model[this.store.schema.idProperty]);
        this.store.bulkDelete(devices).subscribe((responses: ApiResponse[]): void => {
            const failedResponses: ApiResponse[] = responses.filter((resp: ApiResponse): boolean => !resp.isSuccess);
            if (!failedResponses.length) {
                this.selection.deselect(...this.selection.selected);
                this.cdRef.markForCheck();
            }
        });
    }

    protected initSort(): void {
        this.store.dataSource.sortData = (data: S[], sort: MatSort): S[] =>
            sort.direction === 'desc'
                ? reverse(sortBy(data, [(o): any => o[this.mainKey]]))
                : sortBy(data, [(o): any => o[this.mainKey]]);
    }

    protected compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
