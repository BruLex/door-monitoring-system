import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { AppService } from './app.service';

@Injectable({
    providedIn: 'root'
})
export class AppGuard implements CanActivate {
    constructor(private router: Router, private appService: AppService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.appService.apiRequest({ url: 'session/ping' }).pipe(
            mergeMap(pingResp => {
                if (pingResp.isSuccess) {
                    return this.appService.fetchUserData().pipe(map(userDataResp => userDataResp.isSuccess));
                } else {
                    this.router.navigate(['/login']);
                }
            })
        );
    }
}
