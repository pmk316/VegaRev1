import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate{

    canActivate() {
        if (this.authService.isAuthenticated())
            return true;
        
        window.location.href = "https://pmkvegarev1project.auth0.com/login?client=L0lsgaKg1cYWycY06HF16JaPNQhOYiIg";
        return false;
    }

    constructor(protected authService: AuthService) { }
}