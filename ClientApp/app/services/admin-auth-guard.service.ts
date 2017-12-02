import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthGuard } from './auth-guard.service';

@Injectable()
export class AdminAuthGuard extends AuthGuard{

    canActivate() {
        var isAuthenticated = super.canActivate();
        return isAuthenticated? this.authService.isInRole('Admin') : false;
    }

    constructor(authService: AuthService) {
        super(authService);
    }
}