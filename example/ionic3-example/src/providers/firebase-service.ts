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
    if(!firebaseConfig)
      alert("Please add your firebase Config to variable firebaseConfig in\n 'src/providers/firebase-service.ts' file");
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

  getMessageList(userID, channelType)
  {
    return this.fire.getMessageList(userID, channelType);
  }
  sendMessage(uid, message, channelType)
  {
    return this.fire.sendMessage(uid, message, channelType);
  }

  getOnlineStatus(otherUserId)
  {
    return this.fire.getOnlineStatus(otherUserId);
  }

  //to set the isTyping status 
  setTypingStatus(otherUserId, htmlTagId) {
    this.fire.setIsTypingStatus(otherUserId, htmlTagId);
  }

  getTypingStatus(otherUserId) {
    return this.fire.getIsTypingStatus(otherUserId); 
  }

  fileUpload(path, otherUserId, channelType, msgType)
  {
    return this.fire.sendImage(path, otherUserId, channelType, msgType);
  }

  getFile( fileKey )
  {
    return this.fire.getFile(fileKey);
  }

  listenToUpdatedChannels() 
  {
    return this.fire.listenToUpdatedChannels();
  }

  updateProfilePic(filePath, channelType, grpId?)
  {
    if(!grpId)
      return this.fire.updateProfilePic(filePath, channelType);
    else
      return this.fire.updateProfilePic(filePath, channelType, grpId);
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

  createGroup(groupId, groupName, grpProfilePic?)
  {
    return this.fire.groupCreate(groupId, groupName, grpProfilePic);
  }

  addGrpMember(userId, grpId)
  {
    return this.fire.groupAddMember(userId, grpId);
  }

  deleteGroup(grpId)
  {
    return this.fire.groupDelete(grpId);
  }

  getUserDetails(otherUserId)
  {
    return this.fire.getUserDetails(otherUserId);
  }
}
