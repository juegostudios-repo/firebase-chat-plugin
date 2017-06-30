import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FirebaseChat } from 'firebase-chat-plugin';

@Injectable()
export class FirebaseServiceProvider {
  fire;
  currentUser;

  constructor(public http: Http) {
    console.log('Hello FirebaseServiceProvider Provider');
  }

  initializeConfig()
  {
    this.fire = new FirebaseChat({
      apiKey: "AIzaSyAzEUvyyeaBCQW4PPC_i8W11tOPxdwg_q0",
      authDomain: "ionic-chat-app-f71b4.firebaseapp.com",
      databaseURL: "https://ionic-chat-app-f71b4.firebaseio.com",
      projectId: "ionic-chat-app-f71b4",
      storageBucket: "ionic-chat-app-f71b4.appspot.com",
      messagingSenderId: "499915985318"
    }); 
  }

  init(userId, userName?, profilePic?)
  {
    return new Promise((resolve, reject) =>{
      this.fire.initChat(userId, userName, profilePic)
      .then(res => {
        this.currentUser = res;
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
    });
  }

  getRecentChatList()
  {
    return this.fire.getChannelList();
  }

  getMessageList(userID)
  {
    return this.fire.getMessageList(userID);
  }
  sendMessage(uid, message?)
  {
    return this.fire.sendMessage(uid, message);
    
  }

  getOnlineStatus(otherUserId)
  {
    return this.fire.getOnlineStatus(otherUserId);
  }

  //to set the isTyping status 
  setTypingStatus(otherUserId, htmlTagId) {
    console.log("setTypingStatus");
    this.fire.setIsTypingStatus(otherUserId, htmlTagId);
  }

  getTypingStatus(otherUserId) {
    console.log("setTypingStatus");
    return this.fire.getIsTypingStatus(otherUserId); 
  }

  fileUpload(path, otherUserId, type)
  {
    return this.fire.sendImage(path, otherUserId, type);
  }

  getFile( fileKey )
  {
    return this.fire.getFile(fileKey);
  }

  listenToUpdatedChannels() 
  {
    return this.fire.listenToUpdatedChannels();
  }

  updateProfilePic(filePath)
  {
    return this.fire.updateProfilePic(filePath);
  }

}
