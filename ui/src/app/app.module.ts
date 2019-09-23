import {
  MzButtonModule,
  MzCardModule,
  MzIconMdiModule,
  MzIconModule, MzInputModule, MzModalModule,
  MzNavbarModule,
  MzProgressModule,
  MzSidenavModule,
  MzSwitchModule,
  MzTooltipModule
} from 'ngx-materialize';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard';
import { AppService } from './app.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupsComponent } from './groups';
import { DoorsComponent } from './doors';
import { PermissionsComponent } from './permissions';
import { UsersComponent } from './users';
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatDialogModule, MatInputModule,
  MatPaginatorModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { TestTableNgComponent } from './test-table-ng/test-table-ng.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import { SystemLogsComponent } from './system-logs/system-logs.component';

const NGX_MATERIALIZE_IMPORTS = [
  MzNavbarModule,
  MzCardModule,
  MzProgressModule,
  MzSwitchModule,
  MzIconModule,
  MzIconMdiModule,
  MzButtonModule,
  MzTooltipModule,
  MzSidenavModule,
  MzModalModule,
  MzInputModule
];
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
  ScrollingModule
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
    SystemLogsComponent
  ],
  imports: [
    ...NGX_MATERIALIZE_IMPORTS,
    ...ANGULAR_MATERIAL,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
