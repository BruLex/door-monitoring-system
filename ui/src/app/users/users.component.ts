import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppService } from '../app.service';
import { TableAbstract } from '../tools/table-abstract';
import { User } from "../types";

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends TableAbstract<User> {
    loading = false;

    selection: SelectionModel<User> = new SelectionModel<User>(true, []);

    constructor(private appSrv: AppService) {
        super('name');
        appSrv.setAppConfig({ title: 'Users' });
    }

    @ViewChild(MatPaginator, { static: true }) set paginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
        this.dataSource.sort = sort;
    }
}
