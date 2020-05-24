import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { creatValidators } from '@utils';

import { AppService } from '../app.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    errorHint: string = '';
    login: string = '';
    password: string = '';
    formGroup: FormGroup = new FormGroup({
        login: new FormControl(creatValidators({ type: 'str', required: true })),
        password: new FormControl(creatValidators({ type: 'str', required: true }))
    });

    @ViewChild('loginInput', { static: false }) loginInput: ElementRef;
    @ViewChild('passInput', { static: false }) passInput: ElementRef;
    @ViewChild('newLoginInput', { static: false }) newLoginInput: ElementRef;
    @ViewChild('newPassInput', { static: false }) newPassInput: ElementRef;
    @ViewChild('newReEnterPassInput', { static: false }) newReEnterPassInput: ElementRef;

    constructor(private snackBar: MatSnackBar, private router: Router, private appSrv: AppService) {
        appSrv.setAppConfig({ title: 'Login', showNavigation: false });
    }

    openSnackBar(message: string, action?: string): void {
        this.snackBar.open(message, action || 'Close', {
            duration: 3000
        });
    }

    makeLogin(): void {
        const login: string = this.login;
        const password: string = this.password;
        if (!login || !password) {
            this.errorHint = 'Please fill login and password fields';
            return;
        }
        this.appSrv.apiRequest({ url: 'session/login', body: { login, password } }).subscribe((resp) => {
            console.log(resp);
            if (resp.isSuccess) {
                this.router.navigate(['/']);
            } else {
                this.openSnackBar('Login failed: ' + (resp?.message || 'Internal error'));
            }
        });
    }
}
