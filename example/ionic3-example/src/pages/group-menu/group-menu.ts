import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, } from 'ionic-angular';

import { RecentChatListPage } from '../recent-chat-list/recent-chat-list';
import { SelectParticipantPage }  from '../select-participant/select-participant';

import { FirebaseServiceProvider } from '../../providers/firebase-service';
/**
 * Generated class for the GroupMenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-group-menu',
  templateUrl: 'group-menu.html',
})
export class GroupMenuPage {
  grpId;
  participantsList;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCntrl: ModalController,
    private _fire: FirebaseServiceProvider ) {

    this.grpId = this.navParams.get('groupId');
    console.log("GroupId :: ", this.grpId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupMenuPage');
  }

  addMember()
  {
    console.log("clicked add member");
    var selectModal =  this.modalCntrl.create(SelectParticipantPage);
    selectModal.present();
    selectModal.onDidDismiss(data => {
      this.participantsList = data;
      console.log("Members ::");
      console.log(this.participantsList);

    });

  }

  addToGrp()
  {
    var members = this.participantsList;
    var grpId= this.grpId;

    this._fire.addGrpMembers(members, grpId)
    .then(res=> {
      console.log(res);
      // this.navCtrl.pop();
    }) 
    .catch(err => console.log(err));
  }

  deleteGroup()
  {
    console.log("clicked delete group");
    var grpId= this.grpId;
     this._fire.deleteGroup(grpId)
    .then(res => {
      console.log(res);
      this.navCtrl.push(RecentChatListPage);
    })
    .catch(err => console.log(err));
  }
} 
