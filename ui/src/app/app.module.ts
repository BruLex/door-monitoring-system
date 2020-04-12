import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { DashboardComponent } from './dashboard';
import { DevicesComponent } from './devices';
import { GroupsComponent } from './groups';
import { SystemLogsComponent } from './system-logs/system-logs.component';
import { ConfirmDialogComponent } from './tools/confirm-dialog.component';
import { LoadmaskDirective } from './tools/loadmask/loadmask.directive';
import { PopoverComponent } from './tools/popover/popover.component';
import { Popover } from './tools/popover/popover.service';
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
