import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { reverse, sortBy } from 'lodash';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Model } from 'src/app/tools/model';
import { Store } from 'src/app/tools/store';
import { ApiResponse } from 'src/app/types';

export abstract class TableAbstract<S extends Model, T extends Store<S>> implements OnDestroy, OnInit, AfterViewInit {
    abstract sort: MatSort;
    store: T;

    addDialogRef: TemplateRef<ElementRef>;
    addEditModel: S;
    dialogEditMode: boolean;
    selection: SelectionModel<S> = new SelectionModel<S>(true, []);

    subs: Subscription[] = [];

    protected constructor(
        private mainKey: string,
        protected matDialog?: MatDialog,
        protected cdRef?: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.store.reload().subscribe((resp) => {
            if (!resp.isSuccess) {
                console.error(resp.message || 'Internal error');
            }
        });
    }

    ngAfterViewInit(): void {
        this.initSort();
    }

    ngOnDestroy(): void {
        this.subs.forEach((sub) => sub && sub.unsubscribe());
    }

    protected initSort(): void {
        this.store.dataSource.sortData = (data, sort) =>
            sort.direction === 'desc'
                ? reverse(sortBy(data, [(o) => o[this.mainKey]]))
                : sortBy(data, [(o) => o[this.mainKey]]);
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.store.dataSource.data?.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.store.dataSource.data.forEach((row) => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: S): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row[this.mainKey]}`;
    }

    openDialog(mode: 'edit' | 'add', device?: S): void {
        this.addEditModel = device || new this.store.schema.model();
        console.log(this.addEditModel);
        this.dialogEditMode = mode === 'edit';
        this.subs.push(
            this.matDialog
                .open(this.addDialogRef, { width: '500px' })
                .afterClosed()
                .subscribe((create) => {
                    if (create) {
                        AppService.instance().showLoadmask();
                        if (this.dialogEditMode) {
                            this.addEditModel.update().subscribe((resp) => {
                                AppService.instance().hideLoadmask();
                                this.cdRef.markForCheck();
                                if (!resp.isSuccess) {
                                    console.error(resp.message || 'Internal error');
                                }
                            });
                        } else {
                            this.addEditModel.add().subscribe((resp) => {
                                AppService.instance().hideLoadmask();
                                if (resp.isSuccess) {
                                    this.store.dataSource.data = [this.addEditModel, ...this.store.dataSource.data];
                                    this.cdRef.markForCheck();
                                } else {
                                    console.error(resp.message || 'Internal error');
                                }
                            });
                        }
                    }
                })
        );
    }

    deleteModels(): void {
        const devices: number[] = this.selection.selected.map((model) => model[this.store.schema.idProperty]);
        AppService.instance().showLoadmask();
        this.store.bulkDelete(...devices).subscribe((responses) => {
            AppService.instance().hideLoadmask();
            const failedResponses: ApiResponse[] = responses.filter((resp) => !resp.isSuccess);
            console.log(failedResponses);
            if (!failedResponses.length) {
                this.selection.deselect(...this.selection.selected);
                this.cdRef.markForCheck();
            } else {
                console.error(failedResponses[0].message || 'Internal error');
            }
        });
    }

    protected compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
