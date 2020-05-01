import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Overlay } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ApiResponse } from 'src/app/types';

import { DeviceModel, RoleModel, CardModel } from '@models';
import { DeviceStore, RoleStore } from '@stores';
import { AbstractEnityManageComponent } from '@utils';

import { AppService } from '../app.service';

@Component({
    templateUrl: './roles.component.html'
})
export class RolesComponent extends AbstractEnityManageComponent<RoleModel, RoleStore> implements OnInit {
    store: RoleStore = new RoleStore();
    dialogEditMode: boolean;

    @ViewChild('manageEntityDialog') manageEntityDialogRef: TemplateRef<ElementRef>;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    myControl: FormControl = new FormControl();
    devices: DeviceStore = new DeviceStore();
    filteredOptions: Observable<DeviceModel[]> = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value?.name)),
        map(name => (name ? this._filter(name) : this.notAddedDoors))
    );

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.store.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    get notAddedDoors(): DeviceModel[] {
        return (this.devices.items || []).filter(
            (o: DeviceModel): boolean =>
                !(this.currentModel.allowed_devices || []).some(
                    (op: DeviceModel): boolean => op.i_device === o.i_device
                )
        );
    }

    constructor(
        protected matDialog: MatDialog,
        protected cdRef: ChangeDetectorRef,
        private appSrv: AppService,
        private overlay: Overlay
    ) {
        super('name', matDialog, cdRef);
        appSrv.setAppConfig({ title: 'Roles' });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.subs.push(
            combineLatest([this.store.reload().onLoad, this.devices.reload().onLoad]).subscribe(responses =>
                responses.forEach((resp: ApiResponse): void => {
                    if (!resp.isSuccess) {
                        AppService.instance().openSnackBar(resp?.message || 'Internal error');
                    }
                })
            )
        );
    }

    displayFn(card?: CardModel): string | undefined {
        return card ? card.name : undefined;
    }

    addDeviceToModel(device: DeviceModel): void {
        this.currentModel.allowed_devices = [...(this.currentModel.allowed_devices || []), device];
        this.myControl.reset();
    }

    removeDeviceFromModel(door: DeviceModel): void {
        this.currentModel.allowed_devices = this.currentModel.allowed_devices.filter(
            ({ i_device }): boolean => door.i_device !== i_device
        );
        this.myControl.reset();
    }

    private _filter(name: string): any[] {
        const filterValue: string = name.toLowerCase();
        return this.devices.items.filter((o: DeviceModel): boolean => o.name.toLowerCase().indexOf(filterValue) === 0);
    }
}
