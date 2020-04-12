import { SelectionModel } from '@angular/cdk/collections';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DeviceModel, GroupModel } from 'src/app/tools/models';
import { DeviceStore, GroupStore } from 'src/app/tools/stores';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';
import { createFormControl } from '../tools/validations';

@Component({
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss']
})
export class GroupsComponent extends TableAbstract<GroupModel, GroupStore> implements OnInit {
    readonly nameControl: FormControl = createFormControl({ type: 'str', required: true });
    store: GroupStore = new GroupStore();
    dialogEditMode: boolean;
    loading = true;

    @ViewChild('addEditDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;

    myControl = new FormControl();
    doorToAdd: DeviceModel;
    devices: DeviceStore = new DeviceStore();
    filteredOptions: Observable<DeviceModel[]> = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value?.name)),
        map((name) => (name ? this._filter(name) : this.notAddedDoors))
    );

    constructor(
        protected matDialog: MatDialog,
        protected cdRef: ChangeDetectorRef,
        private appSrv: AppService,
        private overlay: Overlay
    ) {
        super('name', matDialog, cdRef);
        appSrv.setAppConfig({ title: 'Groups' });
    }

    ngOnInit(): void {
        super.ngOnInit();
        combineLatest([this.store.reload(), this.devices.reload()]).subscribe((responses) =>
            responses.forEach((resp) => {
                if (!resp.isSuccess) {
                    console.error(resp.message || 'Internal error');
                }
            })
        );
    }

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.store.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    get notAddedDoors(): DeviceModel[] {
        return (this.devices.items || []).filter(
            (o) => !(this.addEditModel.allowed_devices || []).some((op) => op.i_device === o.i_device)
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
                        overlayY: 'bottom'
                    },
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top'
                    }
                ])
                .withFlexibleDimensions(false)
                .withPush(false),
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });
        this.subs.push(overlayRef.backdropClick().subscribe(() => overlayRef.dispose()));
        overlayRef.attach(cdkPortal);
    }

    displayFn(user?): string | undefined {
        return user ? user.name : undefined;
    }

    addDoorToModel(): void {
        this.addEditModel.allowed_devices = [...(this.addEditModel.allowed_devices || []), this.doorToAdd];
        this.doorToAdd = null;
        this.myControl.reset();
    }

    removeDoorFromModel(door: DeviceModel): void {
        this.addEditModel.allowed_devices = this.addEditModel.allowed_devices.filter(
            ({ i_device }) => door.i_device !== i_device
        );
        this.myControl.reset();
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.devices.items.filter((o) => o.name.toLowerCase().indexOf(filterValue) === 0);
    }
}
