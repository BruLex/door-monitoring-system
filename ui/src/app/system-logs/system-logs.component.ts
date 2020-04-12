import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { LogModel } from 'src/app/tools/models';
import { LogStore } from 'src/app/tools/stores';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';

interface LogData {
    i_log: number;
    card_info: { i_card: number; uid: string };
    user_info: object;
    group_info: object;
    door_info: object;
    time: string;
    access: string;
}

@Component({
    templateUrl: './system-logs.component.html',
    styleUrls: ['./system-logs.component.scss']
})
export class SystemLogsComponent extends TableAbstract<LogModel, LogStore> implements AfterViewInit {
    dialog: MatDialog;
    store: LogStore = new LogStore();
    @ViewChild(MatSort) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    constructor(private appSrv: AppService) {
        super('');
        appSrv.setAppConfig({ title: 'System Logs' });
    }

    protected initSort(): void {
        this.subs.push(
            this.store.dataSource.sort.sortChange.subscribe((sort) => {
                const isAsc = sort.direction === 'asc';
                this.store.dataSource.data = this.store.dataSource.data.sort((a, b) => {
                    switch (sort.active) {
                        case 'uid':
                            return this.compare(a.uuid, b.uuid, isAsc);
                        case 'group':
                            return this.compare(a.group_name, b.group_name, isAsc);
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

    compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
