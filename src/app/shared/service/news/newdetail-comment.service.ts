import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import * as io from 'socket.io-client'
import {AccountService} from '../account/account.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NewDetailCommentService {

  socket;

  constructor(private accountService: AccountService) {
  }

  setupSocketConnection() {
    this.socket = io(environment.apiUrl, {
      query: {
        token: this.accountService.userValue.accessToken
      },
    });
  }

   getComment = () => {
    return new Observable((observer) => {
      this.socket.on('user.comment.success', async (data) => {
        observer.next(data);
      });
    });
  }
}

