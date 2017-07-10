import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as FirebaseChat  from 'juegostudio-firebase-chat-plugin';

@Injectable()
export class FirebaseServiceProvider {
  fire;
  currentUser;

  constructor(public http: Http) {
    console.log('Hello FirebaseServiceProvider Provider');
  }

  initializeConfig()
  {
    var firebaseConfig; 
    /* Your firebase config can go here */
    /* It looks like
      var config = {
        apiKey: "xyz",
        authDomain: "xyz.firebaseapp.com",
        databaseURL: "xyz.firebaseio.com",
        projectId: "xyz",
        storageBucket: "xyz.appspot.com",
        messagingSenderId: "0000000000"
      };
    */
    var videoChatServerConfig;    
      /* Your STUN & TURN server config can go here*/
      /* It looks like 
      var videoChatServerConfig = {
      'iceServers': [
        {
          'urls': 'stun:stun.l.google.com:19302'
        },
        {
          'urls': 'yourturn server',
          'username': 'userName',
          'credential': 'credentials'
        },
        {
          'urls': 'turn server',
          'username': 'username',
          'credential' : 'credentials'
        }
      ]
      }
    */ 
    this.fire = new FirebaseChat(firebaseConfig, videoChatServerConfig); 
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

  startVideoCall(ouid)
  {
    return this.fire.initiateCall(ouid);
  }

  listenToVideoCall()
  {
    return this.fire.listenToIncomingCall();
  }

  disconnectCall(channelId)
  {
    this.fire.disconnectCall(channelId);
  }

}
