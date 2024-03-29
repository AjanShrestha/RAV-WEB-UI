import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
// Import our Authentication Service
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (
        private auth: AuthService,
        private router: Router
    ) {}

    canActivate() {
        // If user is not logged in we'll send them to the homepage 
        if (!this.auth.loggedIn()) {
            this.router.navigate(['Login']);
            return false;
        }
        return true;
    }
}