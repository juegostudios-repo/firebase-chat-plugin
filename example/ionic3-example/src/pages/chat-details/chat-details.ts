import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';


import { FirebaseServiceProvider } from '../../providers/firebase-service';
/**
 * Generated class for the ChatDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html',
})
export class ChatDetailsPage {
  userId = localStorage.getItem("user_id");
  channel_id;
  messageList = [];
  otherUserId;
  otherUserPic;
  message;
  onlineStatus = false;
  typingStatus = false;
  myProfilePic;
  otherProfilePic;
  otherUserName;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private _fire: FirebaseServiceProvider,
    private camera: Camera,
    private file: File) {
      if(this._fire.currentUser.displayPhoto !== ' ')
      {
        this._fire.getFile(this._fire.currentUser.displayPhoto)
        .then(data => {
          this.myProfilePic = data;
        })
        .catch(err => console.log(err));
      }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDetailsPage');
  }

  ionViewDidEnter()
  {
    var otherUser = this.navParams.get('otherUser');
    this.otherUserId = otherUser.uid;
    this.otherUserName = otherUser.displayName;
    this.otherUserPic = otherUser.displayPhoto;
    if(this.otherUserPic !== ' ')
    {
      this.otherProfilePic = this.otherUserPic;
    }   
    
    this._fire.getOnlineStatus(this.otherUserId)
    .subscribe(res => {  
      this.setOnlineStatus(res);
    }, err => console.log(err));

    this._fire.getTypingStatus(this.otherUserId)
    .subscribe((res : any) => {
      if(res)
      {
        console.log(res);
        this.typingStatus = res.typingIndicator;
      }
        
    }, err => console.log(err));
    
    this._fire.getMessageList(this.otherUserId)
    .subscribe(res => {
      if(res)
      {
        this.displayMessages(res);
      }
    }, err => console.log(err));

    this._fire.setTypingStatus(this.otherUserId, "inputId");
  }

  displayMessages(messages)
  { 
    this.messageList = this.messageList.concat(messages);
  }

  sendMessage()
  {
    var message = this.message;
    var uid = this.otherUserId;
    this._fire.sendMessage(uid, message)
    .then(res => {
      console.log(res);
    })
    .catch(err => { 
      console.log(err);
     });
  }

  setOnlineStatus(status)
  {
    if(status.isOnline === true)
    {
      this.onlineStatus = status.isOnline;
    }
    else{
      this.onlineStatus = false;
    }
  }

  uploadImage()
  {
     var options = {
      quality: 100,
      targetWidth: 512,
      targetHeight: 512,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    
    this.camera.getPicture(options)
    .then(imagePath => {
        return this.file.resolveLocalFilesystemUrl(imagePath);
    })
    .then((res: any)=>{
      return this._fire.fileUpload(res.nativeURL, this.otherUserId, 'image');
    })
    .then(res=> console.log("image uplaod response = ",res))
    .catch(err=>{
      console.log("image error response =",err)
    });
  }
  getFullImage( fileKey, i )
  {
    this._fire.getFile(fileKey)
    .then(data => {
      this.messageList[i].message = data;
    })
    .catch(err => console.log(err));
  }

  updateProfilePic()
  {
    var options = {
      quality: 100,
      targetWidth: 512,
      targetHeight: 512,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    
    this.camera.getPicture(options)
    .then(imagePath => {
        return this.file.resolveLocalFilesystemUrl(imagePath);
    })
    .then((res: any)=>{
      return this._fire.updateProfilePic(res.nativeURL);
    })
    .then(res=> console.log("image upload response = ",res))
    .catch(err=>{
      console.log("image error response =",err)
    });
  }
}
