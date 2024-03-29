import {Component, OnInit} from '@angular/core';
import {AuthService, User} from './auth.service'
import { Router } from '@angular/router'
 
@Component({
    selector: 'login-form',
    templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
 
    public user = new User('','');
    public errorMsg = '';
 
    constructor(
        private _service:AuthService,
        private _router: Router) {}

    ngOnInit() {
        if (this._service.loggedIn()) {
            this._router.navigate(['Default']);
        }
    }
    login() {
        this._service.login(this.user)
            .then(res => {
                if (res){
                    this._router.navigate(['Default'])
                } else{
                    this.errorMsg = 'Failed to login';
                }
            });
    }
}