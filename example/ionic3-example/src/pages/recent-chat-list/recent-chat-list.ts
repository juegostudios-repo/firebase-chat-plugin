import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FirebaseServiceProvider } from '../../providers/firebase-service';

import { ChatDetailsPage }  from '../chat-details/chat-details';
import { AddNewChatPage }   from '../add-new-chat/add-new-chat';
import { CreateGroupPage }  from '../create-group/create-group';

/**
 * Generated class for the RecentChatListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-recent-chat-list',
  templateUrl: 'recent-chat-list.html',
})
export class RecentChatListPage {

  channelList = [];
  otherUserId;
  message;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private _fire: FirebaseServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecentChatListPage');
   
  }

  ionViewDidEnter() 
  {
    console.log('ionViewDidEnter RecentChatListPage');
     this._fire.getRecentChatList()
    .then((channels: any) => {
      if(channels)
      { console.log("channel list:: ");
        console.log(channels);
        this.displayChannelList(channels)
      }
    })
    .catch(err => console.log(err));

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
    this.navCtrl.push(ChatDetailsPage, { otherUser: obj });
  }

  addNewChat()
  {
    this.navCtrl.push(AddNewChatPage);
  }

  createNewGroup()
  {
    console.log("clicked");
    this.navCtrl.push(CreateGroupPage);
  }

  

}
