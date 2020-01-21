import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';

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
    selector: 'app-system-logs',
    templateUrl: './system-logs.component.html',
    styleUrls: ['./system-logs.component.scss'],
})
export class SystemLogsComponent implements OnInit, AfterViewInit {
    dialog: MatDialog;

    dataSource: MatTableDataSource<LogData> = new MatTableDataSource();

    @ViewChild(MatSort, { static: false }) sort: MatSort;

    start: Date = new Date(2018, 0, 1);
    end: Date = new Date();

    constructor(private appSrv: AppService) {
        appSrv.setAppConfig({ title: 'System Logs' });
        appSrv.apiRequest('logs', 'get_system_logs').subscribe(resp => {
            console.log(resp.isSuccess);

            if (resp.isSuccess) {
                this.dataSource.data = resp.data.logs as LogData[];
            } else {
                console.error('Internal error');
            }
        });
    }

    ngOnInit() {
        this.dataSource.data = [];
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(sort => {
            const isAsc = sort.direction === 'asc';
            const data: LogData[] = this.dataSource.data;
            data.sort((a, b) => {
                switch (this.sort.active) {
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
            this.dataSource.data = data;
        });
    }

    compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
}
