import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { FirebaseServiceProvider } from '../../providers/firebase-service';

import { ChatDetailsPage } from '../chat-details/chat-details';

@IonicPage()
@Component({
  selector: 'page-add-new-chat',
  templateUrl: 'add-new-chat.html',
})
export class AddNewChatPage {
  otherUserId;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alrtCtrl: AlertController,
    private _fire: FirebaseServiceProvider ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewChatPage');
  }

  createChat()
  { 
    this._fire.getUserDetails(this.otherUserId)
    .then(userDetails => {
      if(userDetails.displayPhoto)
      {
        this._fire.getFile(userDetails.displayPhoto)
        .then(data => {
          userDetails.displayPhoto = data;
          this.navCtrl.push(ChatDetailsPage, { otherUser: userDetails });
        })
        .catch(err => console.log(err));
      }
      else
      {
        this.navCtrl.push(ChatDetailsPage, { otherUser: userDetails });
      }
    
    })
    .catch(err => this.showAlert(err.errMsg));
    
  }

  showAlert(errMsg)
  {
    let alert = this.alrtCtrl.create({
      title: 'ERROR',
      subTitle: errMsg,
      buttons: ['OK']
    });
    alert.present();
  }
}
