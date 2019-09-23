import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard';
import {UsersComponent} from './users';
import {DoorsComponent} from './doors';
import {GroupsComponent} from './groups';
import {PermissionsComponent} from './permissions';
import {TestTableNgComponent} from "./test-table-ng/test-table-ng.component";
import {SystemLogsComponent} from "./system-logs/system-logs.component";

const routes: Routes = [
  {path: 'test-table', component: TestTableNgComponent},
  {path: 'system_logs', component: SystemLogsComponent},
  {path: 'doors', component: DoorsComponent},
  {path: 'users', component: UsersComponent},
  {path: 'groups', component: GroupsComponent},
  {path: 'permissions', component: PermissionsComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
