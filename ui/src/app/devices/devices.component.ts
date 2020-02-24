import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';
import { createFormControl } from '../tools/validations';
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

    loading: boolean;
    selection: SelectionModel<DeviceModel> = new SelectionModel<DeviceModel>(true, []);
    addEditModel: DeviceModel;
    dialogEditMode: boolean;

    @ViewChild('addDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;

    constructor(private appSrv: AppService, private matDialog: MatDialog, private cdRef: ChangeDetectorRef) {
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

    openDialog(mode: 'edit' | 'add', device: DeviceModel = {} as DeviceModel): void {
        this.addEditModel = device;
        this.dialogEditMode = mode === 'edit';
        this.subs.push(
            this.matDialog
                .open(this.addDialogRef, { width: '500px' })
                .afterClosed()
                .subscribe(create => {
                    if (create) {
                        this.appSrv.showLoadmask();
                        if (this.dialogEditMode) {
                            this.appSrv.apiRequest('device', 'update_device', this.addEditModel).subscribe(resp => {
                                this.appSrv.hideLoadmask();
                                this.cdRef.markForCheck();
                                if (!resp.isSuccess) {
                                    console.error('Internal error');
                                }
                            });
                        } else {
                            this.appSrv.apiRequest('device', 'add_device', this.addEditModel).subscribe(resp => {
                                this.appSrv.hideLoadmask();
                                if (resp.isSuccess) {
                                    this.dataSource.data = [this.addEditModel, ...this.dataSource.data];
                                    this.cdRef.markForCheck();
                                } else {
                                    console.error('Internal error');
                                }
                            });
                        }
                    }
                })
        );
    }

    deleteModel(): void {
        const devices: number[] = this.selection.selected.map(({ i_device }) => i_device);
        this.appSrv.showLoadmask();
        this.appSrv.apiRequest('device', 'delete_device', { multiple: true, devices }).subscribe(resp => {
            this.appSrv.hideLoadmask();
            if (resp.isSuccess) {
                this.dataSource.data = this.dataSource.data.filter(({ i_device }) => !devices.includes(i_device));
                this.selection.deselect(...this.selection.selected);
                this.cdRef.markForCheck();
            } else {
                console.error('Internal error');
            }
        });
    }
}
