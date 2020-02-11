import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { reverse, sortBy } from 'lodash';

export abstract class TableAbstract<T> implements OnDestroy, AfterViewInit {
    abstract sort: MatSort;

    dataSource: MatTableDataSource<T> = new MatTableDataSource();
    selection: SelectionModel<T> = new SelectionModel<T>(true, []);

    subs: Subscription[] = [];

    protected constructor(private mainKey: string) {
        this.dataSource.data = [];
    }

    ngAfterViewInit(): void {
        this.dataSource.sortData = (data, sort) =>
            sort.direction === 'desc'
                ? reverse(sortBy(data, [o => o[this.mainKey]]))
                : sortBy(data, [o => o[this.mainKey]]);
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub && sub.unsubscribe());
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data?.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: T): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row[this.mainKey]}`;
    }

    protected compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
