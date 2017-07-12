import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { CreateGroupPage } from '../create-group/create-group';
/**
 * Generated class for the SelectParticipantPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-select-participant',
  templateUrl: 'select-participant.html',
})
export class SelectParticipantPage {

  participantList = [];
  userId; 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCntrl: ViewController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectParticipantPage');
  }

  next()
  {
    console.log("clicked next()");
    if(this.userId)
    {
      this.participantList = this.participantList.concat(this.userId);
      this.userId = null;
    }
  }

  done()
  {
    this.participantList = this.participantList.concat(this.userId);
    this.viewCntrl.dismiss(this.participantList);
  }

}
