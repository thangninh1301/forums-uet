import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import {User} from "../../model/Account/Users";
// import {UserUpdate} from "../model/user/userUpdate";

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    // private userSubject_2 : BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        // this.userSubject_2 = new BehaviorSubject<User2>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    // lấy thông tin User
    public get userValue(): User {
        return this.userSubject.value;
    }

    login(user : User) {
        return this.http.post<User>(`${environment.apiUrl}/api/v1/login`, user )
            .pipe(map(users => {
                // lưu user trong local storage để giữ login khi làm mới trang
                localStorage.setItem('user', JSON.stringify(users['data']));
                this.userSubject.next(users['data']);
                return users['data'];
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/register']);
    }

    register(user : User) {
        return this.http.post(`${environment.apiUrl}/api/v1/registration`, user);
    }

    // lấy tất cả user
    getAll(ACCESS_TOKEN) {
        const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
        return this.http.get<User[]>(`${environment.apiUrl}/api/v1/users` , {headers});
    }

    getById(id: any ,ACCESS_TOKEN ) {
        const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
        return this.http.get<User>(`${environment.apiUrl}/api/v1/user?userId=${id}` , {headers});
    }

    // update(params : UserUpdate) {
    //     return this.http.put(`${environment.apiUrl}/api/Users/updateProfile`, params)
    //         .pipe(map(x => {
    //             // update stored user if the logged in user updated their own record
    //             if (params.userId  == this.userValue.id) {
    //                 // update local storage
    //                 const user = { ...this.userValue, ...params };
    //                 localStorage.setItem('user', JSON.stringify(user));
    //                 // publish updated user to subscribers
    //                 this.userSubject.next(user);
                    
    //             }
    //             return x;
    //         }));
            
    // }

    // delete(id: string) {
    //     return this.http.delete(`${environment.apiUrl}/users/${id}`)
    //         .pipe(map(x => {
    //             // auto logout if the logged in user deleted their own record
    //             if (id == this.userValue.id) {
    //                 this.logout();
    //             }
    //             return x;
    //         }));
    // }
}