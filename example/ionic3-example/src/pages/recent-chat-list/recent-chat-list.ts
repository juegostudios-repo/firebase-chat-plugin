import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { FirebaseServiceProvider } from '../../providers/firebase-service';

import { ChatDetailsPage }  from '../chat-details/chat-details';
import { AddNewChatPage }   from '../add-new-chat/add-new-chat';
import { CreateGroupPage }  from '../create-group/create-group';

@IonicPage()
@Component({
  selector: 'page-recent-chat-list',
  templateUrl: 'recent-chat-list.html',
})
export class RecentChatListPage {

  channelList = [];
  otherUserId;
  message;

  showSpinner = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public alrtCtrl: AlertController,
    private _fire: FirebaseServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecentChatListPage');
   
  }

  ionViewDidEnter() 
  {
     this._fire.getRecentChatList()
    .then((channels: any) => {
      if(channels)
      { 
        this.showSpinner = false;
        this.displayChannelList(channels)
      }
    })
    .catch(err => {
      this.showSpinner = false;
      console.log(err);
      this.showAlert("ERROR", "No recent chats");
    });

    this._fire.listenToUpdatedChannels()
    .subscribe(updatedChannels =>{
      this._fire.getRecentChatList()
      .then(channels => {
        if(channels)
        {
          this.displayChannelList(channels)
        }
      })
      .catch(err => console.log(err));
    })
  }

  displayChannelList(channels)
  {
  
    this.channelList = channels;
    this.channelList.forEach((channel, i) => {
  
      if(channel.userDetails.displayPhoto !== ' ')
      { 
      
        this._fire.getFile(channel.userDetails.displayPhoto)
        .then(data => {
          this.channelList[i].userDetails.displayPhoto = data;
        })
        .catch(err => console.log(err));
      }
    });
  }

  goToChatScreen(channel)
  {
    var obj = {
      uid: channel.userDetails.uid,
      displayName: channel.userDetails.displayName,
      displayPhoto: channel.userDetails.displayPhoto,
      channelType: channel.channelType
    };
    if(channel.channelType === 'group')
    {
      obj["grpMembers"] = channel.userDetails.grpMembers;
    }
    this.navCtrl.push(ChatDetailsPage, { otherUser: obj });
  }

  addNewChat()
  {
    this.navCtrl.push(AddNewChatPage);
  }

  createNewGroup()
  {
    this.navCtrl.push(CreateGroupPage);
  }
  showAlert(title, msg)
  {
    let alert = this.alrtCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
