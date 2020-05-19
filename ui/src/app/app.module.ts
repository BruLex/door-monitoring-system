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
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmDialogComponent } from '@utils';
import { LoadmaskDirective } from '@utils/loadmask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppGuard } from './app.guard';
import { AppService } from './app.service';
import { DashboardComponent } from './dashboard';
import { DevicesComponent } from './devices';
import { RolesComponent } from './roles';
import { SystemLogsComponent } from './system-logs/system-logs.component';
import { CardsComponent } from './cards';
import { LoginComponent } from './login/login.component';

const ANGULAR_MATERIAL: any[] = [
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
    MatSnackBarModule
];

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        RolesComponent,
        DevicesComponent,
        CardsComponent,
        SystemLogsComponent,
        LoadmaskDirective,
        ConfirmDialogComponent,
        LoginComponent
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
        MatSelectModule,
        MatMenuModule
    ],
    entryComponents: [ConfirmDialogComponent],
    providers: [AppService, AppGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
