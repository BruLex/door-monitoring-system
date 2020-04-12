import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { GroupModel, UserModel } from '@models';
import { GroupStore, UserStore } from '@stores';
import { AbstractEnityManageComponent } from '@utils/abstract-enity-manage.component';

import { AppService } from '../app.service';
import { ApiResponse } from '../types';

@Component({
    templateUrl: './users.component.html'
})
export class UsersComponent extends AbstractEnityManageComponent<UserModel, UserStore> {
    store: UserStore = new UserStore();
    dialogEditMode: boolean;
    currentModel: UserModel;

    selection: SelectionModel<UserModel> = new SelectionModel<UserModel>(true, []);
    groups: GroupStore = new GroupStore();

    @ViewChild('manageEntityDialog') manageEntityDialogRef: TemplateRef<ElementRef>;

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.store.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    constructor(private appSrv: AppService, protected matDialog: MatDialog, protected cdRef: ChangeDetectorRef) {
        super('name', matDialog, cdRef);
        appSrv.setAppConfig({ title: 'Users' });
        this.groups.reload().onLoad.subscribe((resp: ApiResponse): void => {
            if (!resp.isSuccess) {
                console.error(resp.message || 'Internal error');
            }
        });
    }

    displayGroupName(iGroup: number): string {
        const group: GroupModel = this.groups.dataSource.data.find(({ i_group }): boolean => i_group === iGroup);
        return group ? group.name : 'N/A';
    }
}
