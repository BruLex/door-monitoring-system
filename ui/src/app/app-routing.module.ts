import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard';
import {UsersComponent} from './users';
import {DoorsComponent} from './doors';
import {GroupsComponent} from './groups';
import {PermissionsComponent} from './permissions';

const routes: Routes = [
  {
    path: 'ui', children: [
      {path: 'doors', component: DoorsComponent},
      {path: 'users', component: UsersComponent},
      {path: 'groups', component: GroupsComponent},
      {path: 'permissions', component: PermissionsComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: '**', redirectTo: ''}
    ]
  },
  {path: '', redirectTo: '/ui', pathMatch: 'full'},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
