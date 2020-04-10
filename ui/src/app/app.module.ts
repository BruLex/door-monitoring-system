import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
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
    MatToolbarModule
} from '@angular/material';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { DashboardComponent } from './dashboard';
import { DevicesComponent } from './devices';
import { GroupsComponent } from './groups';
import { SystemLogsComponent } from './system-logs/system-logs.component';
import { ConfirmDialogComponent } from "./tools/confirm-dialog.component";
import { LoadmaskDirective } from './tools/loadmask/loadmask.directive';
import { PopoverComponent } from "./tools/popover/popover.component";
import { Popover } from "./tools/popover/popover.service";
import { UsersComponent } from './users';

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
    MatDividerModule
];

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        GroupsComponent,
        DevicesComponent,
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
        MatChipsModule,
        MatSelectModule
    ],
    entryComponents: [ConfirmDialogComponent, PopoverComponent],
    providers: [AppService, Popover],
    bootstrap: [AppComponent]
})
export class AppModule {}
