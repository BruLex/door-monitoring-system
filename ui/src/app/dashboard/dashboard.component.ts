import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { DeviceModel, LOCK_MODE_ICON_MAP, LockModes } from '@models';
import { DeviceStore } from '@stores';
import { AbstractEnityManageComponent } from '@utils/abstract-enity-manage.component';
import { ApiResponse } from '@utils/types';

import { AppService } from '../app.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends AbstractEnityManageComponent<DeviceModel, DeviceStore> {
    readonly lockModes: typeof LockModes = LockModes;
    readonly lockModeIconMap: typeof LOCK_MODE_ICON_MAP = LOCK_MODE_ICON_MAP;

    store: DeviceStore = new DeviceStore();

    @ViewChild('manageEntityDialog') manageEntityDialogRef: TemplateRef<ElementRef>;

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.store.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    constructor(private appSrv: AppService, protected matDialog: MatDialog, protected cdRef: ChangeDetectorRef) {
        super('name', matDialog, cdRef);
        appSrv.setAppConfig({ title: 'Dashboard' });
    }

    ngOnInit(): void {
        this.store.reload({ with_device_status: true }).onLoad.subscribe((resp: ApiResponse): void => {
            if (!resp.isSuccess) {
                AppService.instance().openSnackBar(resp?.message || 'Internal error');
            }
        });
    }
}
