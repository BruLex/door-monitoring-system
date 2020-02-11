import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';
import { createFormControl } from "../tools/validations";
import { DeviceModel } from '../types';

@Component({
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent extends TableAbstract<DeviceModel> {

    addGroup = new FormGroup({
        name: createFormControl({ type: 'str', required: true }),
        ip: createFormControl({ type: 'ip', required: true }),
        description: createFormControl({ type: 'str', required: false }),
    });

    loading = false;
    selection: SelectionModel<DeviceModel> = new SelectionModel<DeviceModel>(true, []);
    newModel: DeviceModel;

    @ViewChild('addDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;

    constructor(private appSrv: AppService, private matDialog: MatDialog) {
        super('name');
        appSrv.setAppConfig({ title: 'Devices' });
        appSrv.apiRequest('device', 'get_device_list').subscribe(resp => {
            this.loading = false;
            if (resp.isSuccess) {
                this.dataSource.data = resp.data.device_list as DeviceModel[];
            } else {
                console.error('Internal error');
            }
        });

    }

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

    openAdd(): void {
        this.newModel = {} as DeviceModel;
        this.subs.push(
            this.matDialog.open(this.addDialogRef).afterClosed().subscribe(create => {
                if (create) {
                    // TODO send api request and push inside model after success response
                    this.dataSource.data = [this.newModel, ...this.dataSource.data];
                }
            })
        );
    }

    deleteModel(): void {
        this.appSrv.openConfirmDialog({
            message: `Do you realy want to delete ${ this.selection.selected.length } records?`,
            onSuccess: () => {
                // TODO: Send API request
            },
        });
    }

}
