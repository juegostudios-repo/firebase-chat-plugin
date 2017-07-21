import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

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
  

  constructor( public navCtrl: NavController, 
    public alrtCtrl: AlertController,
    private _fire: FirebaseServiceProvider,
    private camera: Camera,
    private file: File ) 
  { 
    this._fire.initializeConfig();
  }

  initChat()
  {
    if(this.myUid)
    {
      this._fire.init(this.myUid, this.userName)
      .then(res=> {
        localStorage.setItem('user_id', this.myUid );
        this.navCtrl.setRoot(RecentChatListPage);
      })
      .catch(err => {
        this.showAlert();
      });
    }
    else
    {
      this.showAlert();
    }
  }

  showAlert()
  {
    let alert = this.alrtCtrl.create({
      title: 'ERROR',
      subTitle: 'UserId is mandatory',
      buttons: ['OK']
    });
    alert.present();
  }
}
