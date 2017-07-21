import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { SelectParticipantPage }  from '../select-participant/select-participant';
import { ChatDetailsPage }        from '../chat-details/chat-details';

import { FirebaseServiceProvider } from '../../providers/firebase-service';

@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {
  groupId;
  groupName;
  groupPic;

  loadingIcon;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCntrl: ModalController,
    public alrtCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private _fire: FirebaseServiceProvider,
    private camera: Camera,
    private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateGroupPage');
  }

  createGroup()
  {
    if(this.groupId && this.groupName)
    {
      var groupId = this.groupId; 
      var groupName = this.groupName;
      var groupPic = this.groupPic;
      this._fire.createGroup(groupId, groupName, groupPic )
      .then(res => {
        if(res)
        {
          var grpInfo = res.responseMessage.grpDetails;
          if(grpInfo.groupPic !== ' ')
          {
            this._fire.getFile(grpInfo.groupPic)
            .then(data => {
              grpInfo.groupPic = data;
              this.navCtrl.push(ChatDetailsPage, { otherUser: 
                  { uid: grpInfo.groupId, 
                    displayPhoto: grpInfo.groupPic, 
                    displayName: grpInfo.groupName, 
                    channelType: grpInfo.channelType
                  } 
                });
            })
            .catch(err => this.showAlert(err.errMsg));
          }
          else
          {
            this.navCtrl.push(ChatDetailsPage, { otherUser: 
              { uid: grpInfo.groupId, 
                displayPhoto: grpInfo.groupPic, 
                displayName: grpInfo.groupName, 
                channelType: grpInfo.channelType
              } 
            });
          }
        }
      })
      .catch(err => {
        this.loadingIcon.dismiss(); 
        this.showAlert(err.errMsg)});
    }
    else if(!this.groupId)
    {
      this.showAlert("GroupID is mandatory");
    }
    else if(!this.groupName)
    {
      this.showAlert("Group name is mandatory");
    }
    else
    {
      this.showAlert("GroupID and Group name are mandatory");
    } 

  }

  upload()
  {
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
        this.groupPic = res.nativeURL;
    })
    .catch(err => console.log(err));
  }
  
  showAlert(errMsg)
  {
    let alert = this.alrtCtrl.create({
      title: "ERROR",
      subTitle: errMsg,
      buttons: ['OK']
    });
    alert.present();
  }
  loading()
  {
    this.loadingIcon = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loadingIcon.present();
  }
}

