import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DeviceModel } from 'src/app/tools/models';
import { DeviceStore } from 'src/app/tools/stores';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';
import { createFormControl } from '../tools/validations';

@Component({
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.scss']
})
export class DevicesComponent extends TableAbstract<DeviceModel, DeviceStore> {
    store: DeviceStore = new DeviceStore();

    addGroup = new FormGroup({
        name: createFormControl({ type: 'str', required: true }),
        ip: createFormControl({ type: 'ip', required: true }),
        description: createFormControl({ type: 'str', required: false })
    });

    loading: boolean;
    selection: SelectionModel<DeviceModel> = new SelectionModel<DeviceModel>(true, []);
    dialogEditMode: boolean;

    @ViewChild('addDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.store.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    constructor(private appSrv: AppService, protected matDialog: MatDialog, protected cdRef: ChangeDetectorRef) {
        super('name', matDialog, cdRef);
        appSrv.setAppConfig({ title: 'Devices' });
    }
}
