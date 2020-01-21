import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';

interface User {
    name: string;
    i_card?: number;
    card_uid: string;
    i_group?: number;
    group: string;
}

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
    loading = false;

    fakeData: User[] = [
        { name: 'user1', card_uid: '32y2642g22', group: 'N/A' },
        { name: 'user2', card_uid: 'eg2412g2s', group: 'managers' },
        { name: 'user3', card_uid: 'rh2grg25h3w', group: 'admins' },
    ];

    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    selection: SelectionModel<User> = new SelectionModel<User>(true, []);
    dataSource: MatTableDataSource<User> = new MatTableDataSource();

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(private appSrv: AppService) {
        appSrv.setAppConfig({ title: 'Users' });
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
}
