//src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
  profile: any;
  private roles: string [] = [];

  auth0 = new auth0.WebAuth({
    clientID: 'L0lsgaKg1cYWycY06HF16JaPNQhOYiIg',
    domain: 'pmkvegarev1project.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.pmkvegarev1.com',
    redirectUri: 'http://localhost:5000/',      
    scope: 'openid'
  });

  constructor(public router: Router) {}

  public isInRole(roleName: any) {
    return this.roles.indexOf(roleName) > -1;
  }

  private readUserFromLocalStorage() {

    //profile
    this.profile = JSON.parse(localStorage.getItem('profile') || '{}');

    //roles
    var token = localStorage.getItem('token');
    if (token) {    
      var jwtHelper = new JwtHelper();
      var decodedToken = jwtHelper.decodeToken(token);
      this.roles = decodedToken['https://pmkvegarev1project.com/roles'] || [];
      console.log("decoded-roles", this.roles);
    }
  }

  public login(): void {
    this.auth0.authorize();
  }
  
  public handleAuthentication(): void {

    this.readUserFromLocalStorage();
    console.log("profile", this.profile);

    this.auth0.parseHash((err :any, authResult: any) => {
      console.log("authResult", authResult);
      if (authResult && authResult.accessToken && authResult.idToken) {
   
      this.auth0.client.userInfo(authResult.accessToken, (error, profile) => {
        if (error)
          throw error;

          console.log("profile", profile);
          localStorage.setItem('profile', JSON.stringify(profile));
          this.readUserFromLocalStorage();
      });

        window.location.hash = '';
        this.setSession(authResult);        
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult: any): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    console.log("setSession::expiresAt", expiresAt)
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    this.profile = null;
    this.roles = [];
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

}