import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    private _fire: FirebaseServiceProvider ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewChatPage');
  }

  createChat()
  { 
    this.navCtrl.push(ChatDetailsPage, { otherUser: { uid: this.otherUserId, displayPhoto: ' ', displayName: "  ", channelType: "one2one"} });
  }
}
