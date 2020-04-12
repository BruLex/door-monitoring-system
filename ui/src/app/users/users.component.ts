import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GroupModel, UserModel } from 'src/app/tools/models';
import { GroupStore, UserStore } from 'src/app/tools/stores';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';
import { createFormControl } from '../tools/validations';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent extends TableAbstract<UserModel, UserStore> {
    addEditUserGroup = new FormGroup({
        name: createFormControl({ type: 'str', required: true }),
        uuid: createFormControl({ type: 'str', required: true })
    });

    loading: boolean;
    dialogEditMode: boolean;
    addEditModel: UserModel;

    selection: SelectionModel<UserModel> = new SelectionModel<UserModel>(true, []);
    groups: GroupStore = new GroupStore();

    @ViewChild('addEditDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.store.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.store.dataSource.sort = sort;
    }

    constructor(private appSrv: AppService, protected matDialog: MatDialog, protected cdRef: ChangeDetectorRef) {
        super('name', matDialog, cdRef);
        appSrv.setAppConfig({ title: 'Users' });
        this.groups.reload().subscribe((resp) => {
            if (!resp.isSuccess) {
                console.error(resp.message || 'Internal error');
            }
        });
    }

    displayGroupName(iGroup: number): string {
        const group: GroupModel = this.groups.dataSource.data.find(({ i_group }) => i_group === iGroup);
        return group ? group.name : 'N/A';
    }
}
