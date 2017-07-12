import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { SelectParticipantPage }  from '../select-participant/select-participant';
import { ChatDetailsPage }        from '../chat-details/chat-details';

import { FirebaseServiceProvider } from '../../providers/firebase-service';

/**
 * Generated class for the CreateGroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {
  participantsList;
  groupId;
  groupName;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCntrl: ModalController,
    private _fire: FirebaseServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateGroupPage');
  }

  selectUser()
  {
    console.log("clicked");

    var selectModal =  this.modalCntrl.create(SelectParticipantPage);
    selectModal.present();
    selectModal.onDidDismiss(data => {
      this.participantsList = data;
    });
  }

  

  createGroup()
  {
    var members = this.participantsList;
    var groupId = this.groupId;
    var groupName = this.groupName;
    this._fire.createGroup( members, groupId, groupName )
    .then(res => {
      this.navCtrl.push(ChatDetailsPage, { otherUser: { uid: this.groupId, displayPhoto: ' ', displayName: this.groupName, channelType: "group"} });
    })
    .catch(err => console.log(err));
  }
  
}

