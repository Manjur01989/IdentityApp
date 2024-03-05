import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { User } from 'src/app/shared/models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  returnUrl : string | null = null;

  constructor(private accountservice: AccountService,
    private frombuilder: FormBuilder
    , private router:Router , private activateRoute : ActivatedRoute) {
      this.accountservice.user$.pipe(take(1)).subscribe({
        next: (user:User | null) => {
          if(user){
            this.router.navigateByUrl('/');
          } 
          else {
            this.activateRoute.queryParamMap.subscribe({
              next : (params : any) => {
                if(params)
                {
                  this.returnUrl = params.get('returnUrl');
                }
              }
            })
          }
        }
      })
     }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.frombuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(){
    this.submitted = true;
    this.errorMessages = [];
    if (this.loginForm.valid) {
      this.accountservice.login(this.loginForm.value).subscribe({
        next: (response : any) => {
          //this.sharedService.showNotification(true,response.value.title,response.value.message);
          //this.router.navigateByUrl('/account/login');
          //console.log(response);
          if(this.returnUrl){
            this.router.navigateByUrl(this.returnUrl);
          } else {
          this.router.navigateByUrl('/');
          }
        },
        error: error => {
          console.log(error);
          if(error.error.errors){
            this.errorMessages = error.error.errors;
          }
          else{
            this.errorMessages.push(error.error);
          }
          
        }
      })
    }
  }
}
