import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { SelectionModel } from "@angular/cdk/collections";
import { merge, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { GroupModel, PeriodicElement } from "../types";
import { MOH_DATA } from "./mohData";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit, AfterViewInit {
    loading = false;
    selection: SelectionModel<GroupModel> = new SelectionModel<GroupModel>(true, []);
    dataSource: MatTableDataSource<GroupModel> = new MatTableDataSource();
    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;

    @ViewChild('loadswitch', { static: true }) loadswitch: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    @ViewChild('addDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;

    fakeData: GroupModel[] = MOH_DATA;

    constructor(private appSrv: AppService, private matDialog: MatDialog) {
        appSrv.setAppConfig({title: 'Groups'});
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => {
            this.sort.direction === 'desc'
                ? this.fakeData.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                : this.fakeData.sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0));
            this.paginator.pageIndex = 0;
        });

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return observableOf(this.fakeData);
                }),
                map(data => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    this.isRateLimitReached = false;
                    this.resultsLength = this.fakeData.length;
                    return data;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isRateLimitReached = true;
                    return observableOf([]);
                })
            )
            .subscribe(data => (this.dataSource.data = data));
    }

    openAdd(): void {
        this.matDialog.open(this.addDialogRef);
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.fakeData.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.fakeData.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: GroupModel): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name}`;
    }

    toggleLoad(checked: boolean) {
        this.appSrv.showLoadmask();
        // timer(3000).subscribe(() => this.appSrv.hideLoadmask());
    }
}
