import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AppService } from '../app.service';
import { TableAbstract } from "../tools/table-abstract";

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
    styleUrls: ['./system-logs.component.scss'],
})
export class SystemLogsComponent extends TableAbstract<LogData> implements AfterViewInit {
    dialog: MatDialog;
    dataSource: MatTableDataSource<LogData> = new MatTableDataSource();

    constructor(private appSrv: AppService) {
        super('');
        appSrv.setAppConfig({ title: 'System Logs' });
        this.subs.push(
            appSrv.apiRequest('logs', 'get_system_logs').subscribe(resp => {
                if (resp.isSuccess) {
                    this.dataSource.data = resp.data.logs as LogData[];
                } else {
                    console.error('Internal error');
                }
            })
        );
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

    ngAfterViewInit(): void {
        this.subs.push(
            this.dataSource.sort.sortChange.subscribe(sort => {
                const isAsc = sort.direction === 'asc';
                this.dataSource.data = this.dataSource.data.sort((a, b) => {
                    switch (sort.active) {
                        case 'uid':
                            return this.compare(a.card_info.uid, b.card_info.uid, isAsc);
                        // case 'group': return this.compare(a.group, b.group, isAsc);
                        // case 'door': return this.compare(a.door, b.door, isAsc);
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
