import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { DashboardComponent } from './dashboard';
import { DevicesComponent } from './devices';
import { GroupsComponent } from './groups';
import { PermissionsComponent } from './permissions';
import { SystemLogsComponent } from './system-logs/system-logs.component';
import { UsersComponent } from './users';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PortalModule } from '@angular/cdk/portal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDividerModule } from '@angular/material/divider';
import { LoadmaskDirective } from './tools/loadmask/loadmask.directive';
import { ConfirmDialogComponent } from "./tools/confirm-dialog.component";
import { PopoverComponent } from "./tools/popover/popover.component";
import { Popover } from "./tools/popover/popover.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";

const ANGULAR_MATERIAL = [
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    ScrollingModule,
    MatSidenavModule,
    MatDividerModule,
];

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        GroupsComponent,
        DevicesComponent,
        PermissionsComponent,
        UsersComponent,
        SystemLogsComponent,
        LoadmaskDirective,
        ConfirmDialogComponent,
        PopoverComponent
    ],
    imports: [
        ...ANGULAR_MATERIAL,
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatListModule,
        MatIconModule,
        PortalModule,
        MatTooltipModule,
        MatBadgeModule,
        MatGridListModule,
        DragDropModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatChipsModule
    ],
    entryComponents: [ConfirmDialogComponent, PopoverComponent],
    providers: [AppService, Popover],
    bootstrap: [AppComponent],
})
export class AppModule {}
