import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../service/api.service";
import { User } from "../model/user.model";
import { constants } from "../model/constants";
import {AppComponent} from "../app.component";
import { faRightToBracket, faDoorClosed } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faRightToBracket = faRightToBracket;
  faDoorClosed = faDoorClosed;

  loginForm = this.formBuilder.group({
    username: ['', Validators.compose([Validators.required])],
    password: ['', Validators.required]
  });

  message: string = "Invalid credentials.";
  logoutMessage: any | undefined
  invalidLogin: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private appComponent: AppComponent) { }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const loginPayload = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }
    this.apiService.login(loginPayload).subscribe(data => {
      if (data.status === 200) {        
        let result = data.result;
        let currentUser: any = new User();
        currentUser.firstName = result.firstName;
        currentUser.lastName = result.lastName;
        currentUser.username = result.username;
        currentUser.authorities = result.authorities;
        localStorage.setItem(constants.TOKEN, result.token);

        this.appComponent.currentUser = currentUser;
        localStorage.setItem(constants.CURRENT_USER, JSON.stringify(currentUser));

        this.router.navigate(['list-user']);
      }else {
        this.invalidLogin = true;
        this.message = data.message;        
      }
    });
  }  

  ngOnInit() {
    localStorage.removeItem(constants.CURRENT_USER);
    localStorage.removeItem(constants.TOKEN);
  }
}
