import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceModel, GroupModel } from '../types';
import { CdkPortal } from "@angular/cdk/portal";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { FormControl } from "@angular/forms";
import { TableAbstract } from "../tools/table-abstract";
import { createFormControl } from "../tools/validations";

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

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

    @ViewChild('addEditDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;

    addEditModel: GroupModel = {} as GroupModel;
    doorToAdd: DeviceModel;
    myControl = new FormControl();
    devices: DeviceModel[] = [];

    filteredOptions: Observable<DeviceModel[]> = this.myControl.valueChanges
        .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value?.name),
            map(name => name
                ? this._filter(name)
                : this.notAddedDoors
            )
        );

    get notAddedDoors(): DeviceModel[] {
        return (this.devices || []).filter(
            o => !(this.addEditModel.allowed_devices || []).some(op => op.i_device === o.i_device)
        );
    }

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

    showOverlay(cdkPortal: CdkPortal, origin: HTMLElement) {
        const overlayRef: OverlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: null,
            positionStrategy: this.overlay.position()
                .flexibleConnectedTo(origin)
                .withPositions([
                    {
                        originX: 'center',
                        originY: 'top',
                        overlayX: 'center',
                        overlayY: 'bottom'
                    },
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top',
                    }
                ])
                .withFlexibleDimensions(false)
                .withPush(false),
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });
        this.subs.push(overlayRef.backdropClick().subscribe(() => overlayRef.dispose()));
        overlayRef.attach(cdkPortal);
    }


    openDialog(mode: 'edit' | 'add', group: GroupModel = {} as GroupModel): void {
        this.dialogEditMode = mode === 'edit';
        this.addEditModel = group;
        this.subs.push(
            this.matDialog.open(this.addDialogRef, { width: '500px', }).afterClosed().subscribe(create => {
                if (create) {
                    // TODO send api request and push inside model after success response
                    this.dataSource.data = [this.addEditModel, ...this.dataSource.data]
                }
            })
        );
    }

    displayFn(user?): string | undefined {
        return user ? user.name : undefined;
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.devices.filter(o => o.name.toLowerCase().indexOf(filterValue) === 0);
    }

    addDoorToModel(): void {

        this.addEditModel.allowed_devices = [...(this.addEditModel.allowed_devices || []), this.doorToAdd];
        this.doorToAdd = null;
        this.myControl.reset();
    }

    removeDoorfromModel(door: DeviceModel): void {
        this.addEditModel.allowed_devices = this.addEditModel.allowed_devices.filter(({ i_device }) => door.i_device !== i_device);
        this.myControl.reset();
    }
}
