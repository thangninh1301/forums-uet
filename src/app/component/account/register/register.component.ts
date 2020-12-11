import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from "../../../shared/service/account/account.service"
import { first, delay } from 'rxjs/operators';
import { StringeeService } from "../../../shared/service/Message/stringee.service"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  checkError = false;
  test: string;
  checkConfirm = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private stringeeService: StringeeService

  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("((09|03|07|08|05|016||012)+([0-9]{8}))")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // PasswordConfirms: ['', [Validators.required, Validators.minLength(6)]]

    });
    /// kiểm tra password và password confirm có giống nhau ko
    // if (this.f.PasswordConfirms.value == null) {
    //   this.checkConfirm = false;
    // }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    // reset khi ấn password
    // this.alertService.clear();
    // dừng nếu form ko hợp lệ
    if (this.form.invalid) {
      this.checkError = false;
      return;
    }
    // if (this.test == null && this.f.Password.value != this.f.PasswordConfirms.value) {
    //   this.checkConfirm = true;
    //   return;
    // }

    this.loading = true;

    // console.log(this.form.value);
    // gọi đến service register
    this.accountService.register(this.form.value)
      // pipe lấy đối tượng đầu tiên
      .pipe(first())
      // delay
      .pipe(delay(500))
      .subscribe(
        data => {
          if (data['success'] == true) {
            var getData = data['data'];
            console.log(getData['regToken']);
            // thành công thì route đến sign in
            this.router.navigate(['/account/login'], { relativeTo: this.route });

            this.stringeeService.Connect(getData['regToken']);
            // update profile lên stringee

            this.stringeeService.stringeeClient.on('connect', (res) => {
              this.stringeeService.listentUpdate(getData['regToken']);
            });
          }else{
            this.router.navigate(['/account/register']);
          }


        },
        error => {
          this.loading = false;
          // lỗi trả veeff message
          this.test = error.error.message;
          // if (this.test != null) {
          //   this.checkError = true;
          // }

        });
  }

}
