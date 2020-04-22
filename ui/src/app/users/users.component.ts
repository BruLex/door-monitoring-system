import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { RoleModel, UserModel } from '@models';
import { RoleStore, UserStore } from '@stores';
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
    roles: RoleStore = new RoleStore();

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
        this.roles.reload().onLoad.subscribe((resp: ApiResponse): void => {
            if (!resp.isSuccess) {
                console.error(resp.message || 'Internal error');
            }
        });
    }

    displayRoleName(iRole: number): string {
        const role: RoleModel = this.roles.dataSource.data.find(({ i_role }): boolean => i_role === iRole);
        return role ? role.name : 'N/A';
    }
}
