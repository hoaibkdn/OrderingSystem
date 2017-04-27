import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserAuthenticationService } from './user-authentication/user-authentication.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private userAuthenticationService: UserAuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean{
    if (this.userAuthenticationService.isLoggedIn()){
      return true
    }
    this.userAuthenticationService.redirectUrl = url;
    this.router.navigate(['/']);
    return false;
  }
}
