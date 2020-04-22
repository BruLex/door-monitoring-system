import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard';
import { DevicesComponent } from './devices';
import { RolesComponent } from './roles';
import { SystemLogsComponent } from './system-logs/system-logs.component';
import { CardsComponent } from './cards';

const routes: Routes = [
    { path: 'system_logs', component: SystemLogsComponent },
    { path: 'devices', component: DevicesComponent },
    { path: 'cards', component: CardsComponent },
    { path: 'roles', component: RolesComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
