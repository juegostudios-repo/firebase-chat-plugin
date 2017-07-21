import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { FirebaseServiceProvider } from '../../providers/firebase-service';

@IonicPage()
@Component({
  selector: 'page-select-participant',
  templateUrl: 'select-participant.html',
})
export class SelectParticipantPage {

  userId; 
  groupId;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alrtCtrl: AlertController,
    private _fire: FirebaseServiceProvider ) {
      this.groupId = this.navParams.get('groupID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectParticipantPage');
  }

  addMember()
  {
    if(this.userId)
    {
      this._fire.addGrpMember(this.userId, this.groupId)
      .then(res => {
        this.showAlert("SUCCESS", "One member added to the group");
      })
      .catch(err => {
        this.showAlert("ERROR", err.errMsg);
      });
    }
    else
    {
      this.showAlert( "ERROR", "UserID is mandatory");
    }
    
  }

  done()
  {
    this.navCtrl.pop();
  }

  back()
  {
    this.navCtrl.pop();
  }

  showAlert(title, errMsg)
  {
    let alert = this.alrtCtrl.create({
      title: title,
      subTitle: errMsg,
      buttons: ['OK']
    });
    alert.present();
  }

}
