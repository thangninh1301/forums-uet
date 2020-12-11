import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/shared/service/account/account.service';
import { StringeeService } from 'src/app/shared/service/Message/stringee.service';
import { first, delay } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    messageError : string;
    checkError = false;
  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private stringeeService : StringeeService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });

  // return ra đường dẫn mặc định
  // this.route.snapshot.queryParams['returnUrl'] || 
  this.returnUrl = '';
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;
      // dùng nếu form ko hợp lệ
      if (this.form.invalid) {
          this.checkError = false;
          return;
      }
    //  console.log(JSON.parse(localStorage.get("user")).name);
      this.loading = true;
      this.accountService.login(this.form.value)
      // pipe lấy đối tượng đầu tiên
          .pipe(first())
          .pipe(delay(500))
          .subscribe(
              data => {
                if(data['_id']){
                  // chạy đến route mặc định
                  this.router.navigate([`${this.returnUrl}/`]);
                  // localStorage.setItem('tokenAccess' , getData['accessToken']);
                  this.stringeeService.Connect(data['accessToken']);
                  // update profile lên stringee
                  this.stringeeService.stringeeClient.on('connect', (res) => {
                    this.stringeeService.listentUpdate(data['accessToken']);
                  });

                }
                   
              },
              error => {
                  this.loading = false;
                  this.messageError = error.error.message;
                  if(this.messageError != null){
                      this.checkError = true;
                  }
                  
              });
             
  }


}
