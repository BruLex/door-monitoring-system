import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
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
import { DoorsComponent } from './doors';
import { GroupsComponent } from './groups';
import { PermissionsComponent } from './permissions';
import { SystemLogsComponent } from './system-logs/system-logs.component';
import { TestTableNgComponent } from './test-table-ng/test-table-ng.component';
import { UsersComponent } from './users';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PortalModule } from "@angular/cdk/portal";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatBadgeModule } from "@angular/material/badge";
import { MatGridListModule } from "@angular/material/grid-list";
import { DragDropModule } from "@angular/cdk/drag-drop";
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
];

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        GroupsComponent,
        DoorsComponent,
        PermissionsComponent,
        UsersComponent,
        TestTableNgComponent,
        SystemLogsComponent,
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
        DragDropModule
    ],
    providers: [AppService],
    bootstrap: [AppComponent],
})
export class AppModule {}
