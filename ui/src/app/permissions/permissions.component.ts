import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
    constructor(private appSrv: AppService) {
        appSrv.setAppConfig({ title: 'Permissions' });
    }

    ngOnInit() {}
}
