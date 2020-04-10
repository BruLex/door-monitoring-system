import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
    message: string;
}

@Component({
    template: `
        <h1 mat-dialog-title>Confirm</h1>
        <div mat-dialog-content>
            <p>{{data.message}}</p>
        </div>
        <div mat-dialog-actions>
            <button mat-button [mat-dialog-close]="false">No</button>
            <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Yes</button>
        </div>
    `
})
export class ConfirmDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }
}
