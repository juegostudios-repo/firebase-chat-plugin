import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { FirebaseServiceProvider } from '../../providers/firebase-service';

import { RecentChatListPage } from '../recent-chat-list/recent-chat-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myUid;
  receiverId;
  message;
  userName;
  profilePic;

  constructor( public navCtrl: NavController, 
    private _fire: FirebaseServiceProvider,
    private camera: Camera,
    private file: File ) 
  { 
    this._fire.initializeConfig();
  }

  initChat()
  {
    this._fire.init(this.myUid, this.userName, this.profilePic)
    .then(res=> {
      console.log(res);
      localStorage.setItem('user_id', this.myUid );
      this.navCtrl.push(RecentChatListPage);
    })
    .catch(err => {
      console.log(err);
    })
  }

  upload()
  {
    console.log("Clicked");
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
        this.profilePic = res.nativeURL;
        console.log("URL -> ",res.nativeURL);
    })
    .catch(err => console.log(err));
  }
}
