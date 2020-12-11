import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StringeeClient, StringeeChat } from "stringee-chat-js-sdk";
import { AccountService } from "../account/account.service";

@Injectable({ providedIn: 'root' })
export class StringeeService {
    stringeeClient = new StringeeClient();
    stringeeChat = new StringeeChat(this.stringeeClient);
    constructor(private accountService: AccountService) {
        // this.stringeeClient.on('connect', function () {
        //     console.log('++++++++++++++ connected to StringeeServer');
        //   });
    }
    Connect(Access_token: string) {
        this.stringeeClient.connect(Access_token, (res) => {
            console.log(res);
        });

    }
    // lắng nghe sự kiện connect
    listentUpdate(Access_token: string) {

        let self = this;
        let userId = this.getCurrentUserIdFromAccessToken(Access_token);
        this.stringeeChat.getUsersInfo([userId], function (status, code, msg, users) {
            // let user = users[0];
            if (1) {
                let username = self.getCurrentUsernameFromAccessToken(Access_token);
                // let avatar = this.getCurrentUserAvatarFromAccessToken(Access_token);
                let useremail = self.getCurrentUserEmailFromAccessToken(Access_token);
                let phone = self.getCurrentPhoneNumberFromAccessToken(Access_token);
                let updateUserData = {
                    display_name: username,
                    avatar_url: "",
                    email: useremail

                }
                self.updateUserInfo(updateUserData);
            }
        })
        // seft.getLastMessage();
    }

    // lắng nghe on connect
    updateConnect(callback: any) {
        let seft = this;
        this.stringeeClient.on('connect', function (res) {
            seft.getLastConversation(callback);
        });
    }


    // Hàm cập nhật thông tin một user , up date lên stringee
    updateUserInfo(data) {
        this.stringeeChat.updateUserInfo(data, function (res) {
            console.log(res)
        });
    }
    // Hàm giải mã token
    decodeToken(token) {

        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
    // Hàm lấy userId hiện tại của người dùng đăng nhập
    getCurrentUserIdFromAccessToken(token) {
        let decodedToken = this.decodeToken(token);
        return decodedToken.userId;
    }
    // Hàm lấy userName hiện tại của người dùng đăng nhập
    getCurrentUsernameFromAccessToken(token) {
        let decodedToken = this.decodeToken(token);
        return decodedToken.fullName;
    }
    //hàm lấy email hiện tại của người dùng đăngg nhập
    getCurrentUserEmailFromAccessToken(token) {
        let decodedToken = this.decodeToken(token);
        return decodedToken.email;
    }
    // hàm lấy phone của người dùng đăng nhập
    getCurrentPhoneNumberFromAccessToken(token) {
        let decodedToken = this.decodeToken(token);
        return decodedToken.phone;
    }

    // tạo cuộc trò chuyện 
    creatAConversation(id, call: any) {
        var userIds = [id];
        var options = {
            //   name: "Your conversation name",
            isDistinct: true,
            isGroup: false
        };
        this.stringeeChat.createConversation(userIds, options, call);


        // this.stringeeChat.createConversation(userIds, options, (status, code, message, conv) => {
        //     console.log('status:' + status + ' code:' + code + ' message:' + message + ' conv:' + JSON.stringify(conv));
        // });

    }

    // tạo nhóm chat
    creatGroupConversation(ids : any ,groupName,  call: any) {
        var userIds = ids;
        var options = {
            name: groupName,
            isDistinct: false,
            isGroup: true
        };
        this.stringeeChat.createConversation(userIds, options, call);
            
      
        // this.stringeeChat.createConversation(userIds, options, (status, code, message, conv) => {
        //     console.log('status:' + status + ' code:' + code + ' message:' + message + ' conv:' + JSON.stringify(conv));
        // });

    }


    // lấy các conv
    getLastConversation(callback: any) {
        let seft = this;

        var count = 50;
        var isAscending = false;
        seft.stringeeChat.getLastConversations(count, isAscending, callback);

    }

    // gửi tin nhắn dạng text
    sendTextMessage(convId, message) {
        var txtMsg = {
            type: 1,
            convId: convId,
            message: {
                content: message,
                metadata: {
                    key: 'value'
                }
            }
        };

        this.stringeeChat.sendMessage(txtMsg, function (status, code, message, msg) {
            console.log(status + code + message + "msg result " + JSON.stringify(msg));
        });

    }

    // gửi tin nhắn img
    sendImgMessage(conId, imgurl) {

        var imgMsg = {
            type: 2,
            convId: conId,
            message: {
                content: "",
                photo: {
                    filePath: imgurl,
                    thumbnail: "",
                    ratio: ""
                },
                metadata: {
                    key: 'value'
                }
            }
        };
        this.stringeeChat.sendMessage(imgMsg, function (status, code, message, msg) {

        });
    }

    // gửi tin nhắn file
    sendFileMessage(conId, filePath, fileName, length) {

        var fileMsg = {
            type: 5,
            convId: conId,
            message: {
                content: "",
                // File
                file: {
                    filePath: filePath,// file's url.
                    filename: fileName,
                    length: length // number type, number of bytes
                },
                metadata: {
                    key: 'value'
                }
            }
        };
        this.stringeeChat.sendMessage(fileMsg, function (status, code, message, msg) {
            console.log(status + code + message + "msg result " + JSON.stringify(msg));
        });

    }

    // lấy tin nhắn của 1 cuộc trò chuyện
    getLastMessage(convid, call: any) {
        var convId = convid;
        var count = 15;
        var isAscending = true;

        this.stringeeChat.getLastMessages(convId, count, isAscending, call);

    }

    // lấy các tin nhắn trước đó , để thực hiện load more
    getLastMessageBefore(convid, sequence, call: any) {
        var convId = convid;
        var count = 15;
        var isAscending = true;

        this.stringeeChat.getMessagesBefore(convId, sequence, count, isAscending, call);
    }

    // hàm đánh dấu là conv đã đọc
    markConversationAsRead(convid) {
        var convId = convid;
        this.stringeeChat.markConversationAsRead(convId, function (res) {
            // this.setTotalUnReadConvs();
        });

    }

    // khi người dùng gõ tin nhắn
    /**
 * Hàm xử lý khi khi người dùng gõ tin nhắn
 * @param {*} convId 
 */
    userBeginTyping(convId, userId) {
        var userId = userId;
        let self = this;
        if (convId && userId) {
            const body = { userId: userId, convId: convId };
            self.stringeeChat.userBeginTyping(body, function (res) {
                console.log(res);
            });
        }
    }
    /**
     * Hàm xử lý khi người dùng dừng gõ tin nhắn
     * @param {*} convId 
     */
    userEndTyping(convId, userId) {
        var userId = userId;
        if (convId && userId) {
            const body = { userId: userId, convId: convId };
            this.stringeeChat.userEndTyping(body, function (res) {
                // console.log(res);
            });
        }
    }

}