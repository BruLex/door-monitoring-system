import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard';
import { DevicesComponent } from './devices';
import { GroupsComponent } from './groups';
import { PermissionsComponent } from './permissions';
import { SystemLogsComponent } from './system-logs/system-logs.component';
import { UsersComponent } from './users';

const routes: Routes = [
    { path: 'system_logs', component: SystemLogsComponent },
    { path: 'devices', component: DevicesComponent },
    { path: 'users', component: UsersComponent },
    { path: 'groups', component: GroupsComponent },
    { path: 'permissions', component: PermissionsComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
