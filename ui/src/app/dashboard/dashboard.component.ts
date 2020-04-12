/* tslint:disable:array-type */
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MonitorModel } from 'src/app/tools/models';
import { MonitorStore } from 'src/app/tools/stores';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';

enum DoorStatus {
    Offline,
    Online
}

enum LockedStatus {
    Locked,
    Uocked,
    Guard
}

const STATUS_ICON = {
    locked: 'lock',
    unlocked: 'lock_open',
    guard: 'security',
    opened: 'verified_user'
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends TableAbstract<MonitorModel, MonitorStore> {
    store: MonitorStore = new MonitorStore();

    loading = false;

    modelData: MonitorModel[] = [
        {
            mac: 'A4-71-9F-DB-1B-B4',
            status: false,
            locked: false,
            icon: 'security'
        },
        { mac: 'A4-71-9F-DB-1B-B3', status: true, locked: true, icon: 'lock' },
        {
            mac: 'A4-71-9F-DB-1B-B3',
            status: false,
            locked: false,
            icon: 'lock_open'
        },
        {
            mac: 'A4-71-9F-DB-1B-B2',
            status: true,
            locked: false,
            icon: 'verified_user'
        }
    ] as MonitorModel[];

    constructor(private appSrv: AppService) {
        super('mac');
        appSrv.setAppConfig({ title: 'Dashboard' });
        this.store.dataSource.data = this.modelData;
    }

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.store.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }
}
