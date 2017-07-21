import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController } from 'ionic-angular';

import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { SelectParticipantPage }  from '../select-participant/select-participant';

import { FirebaseServiceProvider } from '../../providers/firebase-service';

@IonicPage()
@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html',
})
export class ChatDetailsPage {

  userId = localStorage.getItem("user_id");
  channel_id;
  messageList = [];
  otherUserId;
  otherUserPic;
  message;
  onlineStatus = false;
  typingStatus = false;
  myProfilePic;
  otherProfilePic;
  otherUserName;
  channelType;
  groupMembers;

  showLoadingSpinner = true;

  videoCallOverlay = false;
  myVideoSource;
  remoteVideoSource:SafeUrl;
  videoChannelId;

  spinnerHide = [];
  downloadHide = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public modalCntrl: ModalController,
    public alertCtrl: AlertController,
    private _fire: FirebaseServiceProvider,
    private camera: Camera,
    private file: File,
    private sanitizer: DomSanitizer) {
      if(this._fire.currentUser.displayPhoto !== ' ')
      {
        this._fire.getFile(this._fire.currentUser.displayPhoto)
        .then(data => {
          this.myProfilePic = data;
        })
        .catch(err => console.log(err));
      }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDetailsPage');
  }

  ionViewDidEnter()
  {
    var otherUser = this.navParams.get('otherUser');
    this.channelType = otherUser.channelType;
    this.otherUserId = otherUser.uid;
    this.otherUserName = otherUser.displayName;
    this.otherUserPic = otherUser.displayPhoto;
    if(this.channelType === "group")
    {
      this.groupMembers = otherUser.grpMembers;
    }
    if(this.otherUserPic !== ' ')
    {
      this.otherProfilePic = this.otherUserPic;
    }   
    
    if(this.channelType === "one2one")
    {
      this._fire.getOnlineStatus(this.otherUserId)
      .subscribe(res => {  
        this.setOnlineStatus(res);
      }, err => console.log(err));

      this._fire.getTypingStatus(this.otherUserId)
      .subscribe((res : any) => {
        if(res)
        {
          this.typingStatus = res.typingIndicator;
        }
          
      }, err => console.log(err));

      this._fire.setTypingStatus(this.otherUserId, "inputId");
    }
    
    this._fire.getMessageList(this.otherUserId, this.channelType)
    .subscribe(res => {
      if(res)
      {
        this.showLoadingSpinner = false;
        this.displayMessages(res);
      }
    }, err => {
      this.showLoadingSpinner = false;
      this.showAlert("ERROR", "Something went wrong. Try again");
      console.log(err);
    });
    
    this._fire.listenToVideoCall().subscribe(res=>{
      var confir = confirm( res.initiatedBy + " Calling...");
      if(confir){
        this.acceptCall(res);
      }
    });
  }

  displayMessages(messages)
  { 
    this.messageList = this.messageList.concat(messages);
    this.messageList.forEach((msg, i) => {
      var date = new Date(msg.timestamp);
      var time = date.toLocaleString();
      this.spinnerHide[i] = true;
      this.downloadHide[i] = false;
      this.messageList[i]["time"] = time;
      //adding username for the member
      if(this.channelType === 'group')
      {
        this.groupMembers.forEach(member => {
          if(member.uid === msg.uid)
          {
            this.messageList[i]["userName"] = member.userName;
          }
        })
      } 
    })
  }

  sendMessage()
  {
    if(this.message)
    {
      var message = this.message;
      var uid = this.otherUserId;
      this._fire.sendMessage(uid, message, this.channelType)
      .then(res => {
        this.message = ' ';
        console.log(res);
      })
      .catch(err => { 
        console.log(err);
      });
      
    }
    else
    {
      this.showAlert("ERROR", "Type something to send");
    }  
  }

  setOnlineStatus(status)
  {
    if(status.isOnline === true)
    {
      this.onlineStatus = status.isOnline;
    }
    else{
      this.onlineStatus = false;
    }
  }

  uploadImage()
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
      return this._fire.fileUpload(res.nativeURL, this.otherUserId, this.channelType, 'image');
    })
    .then(res=> console.log("image uplaod response = ",res))
    .catch(err=>{
      console.log("image error response =",err)
    });
  }
  getFullImage( fileKey, i )
  {
    this.downloadHide[i] = true;
    this.spinnerHide[i] = false;
    this._fire.getFile(fileKey)
    .then(data => {
      this.messageList[i].message = data;
      this.spinnerHide[i] = true;
    })
    .catch(err => console.log(err));
  }

  
  acceptCall(channel)
  {
    this.videoChannelId = channel.channelId;
    this._fire.fire.acceptCall(channel.channelId,channel.initiatedBy)
    .then(res=>{
      this.videoCallOverlay = true;
      this.myVideoSource = this.sanitizer.bypassSecurityTrustUrl(res.localVideoSrc);
      //this.remoteVideoSource = this.sanitizer.bypassSecurityTrustUrl(this._fire.fire.remoteStreamSrc);
    });
  }
  
  startVideoCall()
  {
    ///alert(this.otherUserId)
    this._fire.startVideoCall(this.otherUserId)
    .then(response=>{
      this.videoCallOverlay = true;
      this.videoChannelId = response.channelId;
      this.myVideoSource = this.sanitizer.bypassSecurityTrustUrl(response.localVideoSrc);
      //this.remoteVideoSource = this.sanitizer.bypassSecurityTrustUrl(this._fire.fire.remoteStreamSrc) ;
    })
    .catch(err=>{
      console.log(err)
    });
  }

  disconnectCall()
  {
    this.videoCallOverlay = false;
    this._fire.disconnectCall(this.videoChannelId);
  }

  getUrl()
  {
    if(!this.remoteVideoSource && this._fire.fire.remoteStreamSrc)
    {
      this.remoteVideoSource = this.sanitizer.bypassSecurityTrustUrl(this._fire.fire.remoteStreamSrc);
      return this.remoteVideoSource;
    } else if(this.remoteVideoSource){
      return this.remoteVideoSource;
    }
  }

  ionViewWillEnter()
  {
    this.messageList = [];
  }

  back()
  {
    this.navCtrl.popToRoot();
  }

   addMember()
  {    
    var grpID = this.otherUserId;
    var selectModal =  this.modalCntrl.create(SelectParticipantPage, { groupID: grpID });
    selectModal.present();
  }
  
  deleteGroup()
  {
    var grpId = this.otherUserId;
     this._fire.deleteGroup(grpId)
    .then(res => {
      this.navCtrl.popToRoot();
    })
    .catch(err => this.showAlert("ERROR", err.errMsg));
  }

  updateProfilePic()
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
        var grpId = this.otherUserId;
        this._fire.updateProfilePic(res.nativeURL, 'group', grpId)
        .then(res => console.log(res))
        .catch(err => this.showAlert("ERROR", "Group picture updation failed!!"));
        
    })
    .catch(err => this.showAlert("ERROR", err));
  }

  showSettings()
  {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Settings',
      buttons: [
        {
          text: 'Add member',
          handler: () => {
            this.addMember();
          }
        },
        {
          text: 'Delete group',
          handler: () => {
            this.deleteGroup();
          }
        },
        {
          text: 'Change group Pic',
          handler: () => {
            this.updateProfilePic();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log("cancel clicked");
          }
        }
      ]

    });
    actionSheet.present();
  }

  showAlert(title, message)
  {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}