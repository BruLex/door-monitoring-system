import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';
import { createFormControl } from "../tools/validations";
import { DeviceModel, GroupModel, UserModel } from "../types";

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent extends TableAbstract<UserModel> {

    addEditUserGroup = new FormGroup({
        name: createFormControl({ type: 'str', required: true }),
        uuid: createFormControl({ type: 'str', required: true })
    });

    loading: boolean;
    dialogEditMode: boolean;
    addEditModel: UserModel;

    selection: SelectionModel<UserModel> = new SelectionModel<UserModel>(true, []);
    groups: GroupModel[] = [];

    @ViewChild('addEditDialog', { static: false }) addDialogRef: TemplateRef<ElementRef>;

    constructor(private appSrv: AppService, private matDialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super('name');
        appSrv.setAppConfig({ title: 'Users' });

        this.subs.push(
            appSrv.apiRequest('user', 'get_user_list').subscribe(resp => {
                this.loading = false;
                if (resp.isSuccess) {
                    this.dataSource.data = resp.data.user_list as UserModel[];
                    this.cdRef.markForCheck();
                } else {
                    console.error('Internal error');
                }
            }),
            appSrv.apiRequest('group', 'get_group_list').subscribe(resp => {
                this.loading = false;
                if (resp.isSuccess) {
                    this.groups = resp.data.group_list as DeviceModel[];
                    this.cdRef.markForCheck();
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

    displayGroupName(iGroup: number): string {
        const group: GroupModel = this.groups.find(({i_group}) => i_group === iGroup);
        return group ? group.name : 'N/A';
    }

    openDialog(mode: 'edit' | 'add', user: UserModel = {} as UserModel): void {
        this.dialogEditMode = mode === 'edit';
        this.addEditModel = user;
        this.subs.push(
            this.matDialog
                .open(this.addDialogRef, { width: '500px' })
                .afterClosed()
                .subscribe(create => {
                    if (create) {
                        this.appSrv.showLoadmask();
                        if (this.dialogEditMode) {
                            this.appSrv.apiRequest('user', 'update_user', this.addEditModel).subscribe(resp => {
                                this.appSrv.hideLoadmask();
                                this.cdRef.markForCheck();
                                if (!resp.isSuccess) {
                                    console.error('Internal error');
                                }
                            });
                        } else {
                            this.appSrv.apiRequest('user', 'add_user', this.addEditModel).subscribe(resp => {
                                this.appSrv.hideLoadmask();
                                if (resp.isSuccess) {
                                    this.addEditModel.i_user = resp.data.i_user;
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

    deleteUsers(): void {
        const users: number[] = this.selection.selected.map(({ i_user }) => i_user);
        this.appSrv.showLoadmask();
        this.appSrv.apiRequest('user', 'delete_user', { multiple: true, users }).subscribe(resp => {
            this.appSrv.hideLoadmask();
            if (resp.isSuccess) {
                this.dataSource.data = this.dataSource.data.filter(({ i_user }) => !users.includes(i_user));
                this.selection.deselect(...this.selection.selected);
            } else {
                console.error('Internal error');
            }
        });
    }
}
