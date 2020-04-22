import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { AbstractEnityManageComponent } from 'src/app/utils/abstract-enity-manage.component';
import { LogModel } from 'src/app/utils/models';
import { LogStore } from 'src/app/utils/stores';

import { AppService } from '../app.service';

@Component({
    templateUrl: './system-logs.component.html',
    styleUrls: ['./system-logs.component.scss']
})
export class SystemLogsComponent extends AbstractEnityManageComponent<LogModel, LogStore> implements AfterViewInit {
    dialog: MatDialog;
    store: LogStore = new LogStore();

    @ViewChild(MatSort) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    constructor(private appSrv: AppService) {
        super('');
        appSrv.setAppConfig({ title: 'System Logs' });
    }

    compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    protected initSort(): void {
        this.subs.push(
            this.store.dataSource.sort.sortChange.subscribe((sort): void => {
                const isAsc: boolean = sort.direction === 'asc';
                this.store.dataSource.data = this.store.dataSource.data.sort((a: LogModel, b: LogModel): number => {
                    switch (sort.active) {
                        case 'uid':
                            return this.compare(a.uuid, b.uuid, isAsc);
                        case 'role':
                            return this.compare(a.role_name, b.role_name, isAsc);
                        case 'device':
                            return this.compare(a.device_name, b.device_name, isAsc);
                        case 'time':
                            return this.compare(new Date(a.time).getTime(), new Date(b.time).getTime(), isAsc);
                        case 'access':
                            return this.compare(a.access, b.access, isAsc);
                        default:
                            return 0;
                    }
                });
            })
        );
    }
}
