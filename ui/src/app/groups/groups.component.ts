import { SelectionModel } from '@angular/cdk/collections';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';
import { createFormControl } from '../tools/validations';
import { DeviceModel, GroupModel } from '../types';

@Component({
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent extends TableAbstract<any> {
    readonly nameControl: FormControl = createFormControl({ type: 'str', required: true });

    dialogEditMode: boolean;
    loading = true;
    selection: SelectionModel<GroupModel> = new SelectionModel<GroupModel>(true, []);
    dataSource: MatTableDataSource<GroupModel> = new MatTableDataSource();
    @ViewChild('addEditDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;
    addEditModel: GroupModel = {} as GroupModel;
    doorToAdd: DeviceModel;
    myControl = new FormControl();
    devices: DeviceModel[] = [];
    filteredOptions: Observable<DeviceModel[]> = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value?.name)),
        map(name => (name ? this._filter(name) : this.notAddedDoors))
    );

    constructor(private appSrv: AppService, private matDialog: MatDialog, private overlay: Overlay) {
        super('name');
        appSrv.setAppConfig({ title: 'Groups' });
        this.subs.push(
            appSrv.apiRequest('group', 'get_group_list', { with_extended_info: true }).subscribe(resp => {
                this.loading = false;
                if (resp.isSuccess) {
                    this.dataSource.data = resp.data.group_list as GroupModel[];
                } else {
                    console.error('Internal error');
                }
            }),
            appSrv.apiRequest('device', 'get_device_list').subscribe(resp => {
                this.loading = false;
                if (resp.isSuccess) {
                    this.devices = resp.data.device_list as DeviceModel[];
                } else {
                    console.error('Internal error');
                }
            })
        );
    }

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

    get notAddedDoors(): DeviceModel[] {
        return (this.devices || []).filter(
            o => !(this.addEditModel.allowed_devices || []).some(op => op.i_device === o.i_device)
        );
    }

    showOverlay(cdkPortal: CdkPortal, origin: ElementRef) {
        const overlayRef: OverlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: null,
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(origin)
                .withPositions([
                    {
                        originX: 'center',
                        originY: 'top',
                        overlayX: 'center',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top',
                    },
                ])
                .withFlexibleDimensions(false)
                .withPush(false),
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
        });
        this.subs.push(overlayRef.backdropClick().subscribe(() => overlayRef.dispose()));
        overlayRef.attach(cdkPortal);
    }

    openDialog(mode: 'edit' | 'add', group: GroupModel = {} as GroupModel): void {
        this.dialogEditMode = mode === 'edit';
        this.addEditModel = group;
        this.subs.push(
            this.matDialog
                .open(this.addDialogRef, { width: '500px' })
                .afterClosed()
                .subscribe(create => {
                    if (create) {
                        this.appSrv.showLoadmask();
                        if (this.dialogEditMode) {
                            this.appSrv.apiRequest('group', 'update_group', this.addEditModel).subscribe(resp => {
                                this.appSrv.hideLoadmask();
                                if (!resp.isSuccess) {
                                    console.error('Internal error');
                                }
                            });
                        } else {
                            this.appSrv.apiRequest('group', 'add_group', this.addEditModel).subscribe(resp => {
                                this.appSrv.hideLoadmask();
                                if (resp.isSuccess) {
                                    this.dataSource.data = [this.addEditModel, ...this.dataSource.data];
                                } else {
                                    console.error('Internal error');
                                }
                            });
                        }
                    }
                })
        );
    }

    deleteGroups(): void {
        const groups: number[] = this.selection.selected.map(({ i_group }) => i_group);
        this.appSrv.showLoadmask();
        this.appSrv.apiRequest('group', 'delete_group', { multiple: true, groups }).subscribe(resp => {
            this.appSrv.hideLoadmask();
            if (resp.isSuccess) {
                this.dataSource.data = this.dataSource.data.filter(({ i_group }) => !groups.includes(i_group));
                this.selection.deselect(...this.selection.selected);
            } else {
                console.error('Internal error');
            }
        });
    }

    displayFn(user?): string | undefined {
        return user ? user.name : undefined;
    }

    addDoorToModel(): void {
        this.addEditModel.allowed_devices = [...(this.addEditModel.allowed_devices || []), this.doorToAdd];
        this.doorToAdd = null;
        this.myControl.reset();
    }

    removeDoorfromModel(door: DeviceModel): void {
        this.addEditModel.allowed_devices = this.addEditModel.allowed_devices.filter(
            ({ i_device }) => door.i_device !== i_device
        );
        this.myControl.reset();
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.devices.filter(o => o.name.toLowerCase().indexOf(filterValue) === 0);
    }
}
