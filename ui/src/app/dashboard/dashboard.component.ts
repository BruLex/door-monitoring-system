/* tslint:disable:array-type */
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { combineLatest, observable, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';

interface DoorData {
    mac: string;
    locked: boolean;
    status: boolean;
    icon: 'lock' | 'lock_open' | 'security' | 'verified_user';
}

enum DoorStatus {
    Offline,
    Online,
}

enum LockedStatus {
    Locked,
    Uocked,
    Guard,
}

const STATUS_ICON = {
    locked: 'lock',
    unlocked: 'lock_open',
    guard: 'security',
    opened: 'verified_user',
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent extends TableAbstract<DoorData> {
    loading = false;

    modelData: DoorData[] = [
        {
            mac: 'A4-71-9F-DB-1B-B4',
            status: false,
            locked: false,
            icon: 'security',
        },
        { mac: 'A4-71-9F-DB-1B-B3', status: true, locked: true, icon: 'lock' },
        {
            mac: 'A4-71-9F-DB-1B-B3',
            status: false,
            locked: false,
            icon: 'lock_open',
        },
        {
            mac: 'A4-71-9F-DB-1B-B2',
            status: true,
            locked: false,
            icon: 'verified_user',
        },
    ];

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

    constructor(private appSrv: AppService, private httpClient: HttpClient) {
        super('mac');
        appSrv.setAppConfig({ title: 'Dashboard' });
        this.dataSource.data = this.modelData;
    }
}
