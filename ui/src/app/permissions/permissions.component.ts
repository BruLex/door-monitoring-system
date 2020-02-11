import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
    myControl = new FormControl();

    options = [
        {name: 'Mary'},
        {name: 'Shelley'},
        {name: 'Igor'}
    ];
    filteredOptions: Observable<any>;

    constructor(private appSrv: AppService) {
        appSrv.setAppConfig({ title: 'Permissions' });
    }

    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filter(name) : this.options.slice())
            );
    }


    displayFn(user?): string | undefined {
        return user ? user.name : undefined;
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
}
