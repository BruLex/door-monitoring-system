import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { AbstractEnityManageComponent } from 'src/app/utils/abstract-enity-manage.component';
import { DeviceModel } from 'src/app/utils/models';
import { DeviceStore } from 'src/app/utils/stores';

import { AppService } from '../app.service';

@Component({
    templateUrl: './devices.component.html'
})
export class DevicesComponent extends AbstractEnityManageComponent<DeviceModel, DeviceStore> {
    store: DeviceStore = new DeviceStore();
    selection: SelectionModel<DeviceModel> = new SelectionModel<DeviceModel>(true, []);
    dialogEditMode: boolean;

    @ViewChild('manageEntityDialog') manageEntityDialogRef: TemplateRef<ElementRef>;

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.store.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    constructor(private appSrv: AppService, protected matDialog: MatDialog, protected cdRef: ChangeDetectorRef) {
        super('name', matDialog, cdRef);
        appSrv.setAppConfig({ title: 'Devices' });
    }
}
