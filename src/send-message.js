const firebase = require('firebase');

var getChannelIdForUser = require('./get-channelid');

function sendMessage(otherUserId, message, messageType, fileKey)
{
  console.log("Sending message");
  if(!messageType){
    messageType = 'text';
  }
  return new Promise((resolve, reject)=>{
    var channelId = getChannelIdForUser(otherUserId, this.user.channelList);
    var lastActivity = firebase.database.ServerValue.TIMESTAMP;
    console.log("ChannelId :: " + channelId);
    if(channelId)
    {
      var time = Date.now() + this.serverTimeOffset;
      var messageObj;
      messageObj = {
        uid: this.user.uid,
        userName: this.user.displayName,
        displayPhoto: this.user.displayPhoto,
        message: message,
        messageType: messageType,
        timestamp: time,
        negativetimestamp: - time
      };
      if(messageType === 'image'){
        messageObj.fileKey =  fileKey;
      }
      this.db.ref('/channel/' + channelId + '/lastMessage').set(message);
      this.db.ref('/channel/' + channelId + '/lastActivity').set(lastActivity);
      this.db.ref('/channel/' + channelId + '/messages/').push(messageObj)
      .then(messageSentResponse=> { 
        resolve(messageObj); 
      })
      .catch(errorMessage=> { reject(errorMessage) });
    } else{
      console.log("Channel Does not exist");
      // Creating channel if channel does not exist;
    }
  });
}

module.exports = sendMessage;

  // sendMessage( otherUserId, message, messageType?: string, fileKey?: any)
  // {
  //   if(!messageType){
  //     messageType = 'text';
  //   }
  //   var myUserId = this.user.uid;
  //   return new Promise((resolve, reject) => {
  //     var subscriber = this.db.list('/users',{ query:{ orderByChild: 'uid', equalTo: myUserId } })
  //     .subscribe( res => { 
  //       var channelId = this.getChannelIdForUser(otherUserId, res[0].channelList);
  //       subscriber.unsubscribe();
  //       var lastActivity = firebase.database.ServerValue.TIMESTAMP;
  //       if(channelId)
  //       {
  //         // Channel exist with other user, push ur message to this channel
  //         var time = Date.now() + this.serverTimeOffset;
  //         var messageObj;
  //         messageObj = {
  //           uid: this.user.uid,
  //           userName: this.user.displayName,
  //           displayPhoto: this.user.displayPhoto,
  //           message: message,
  //           messageType: messageType,
  //           timestamp: time,
  //           negativetimestamp: - time
  //         }
  //         if(messageType === 'image'){
  //             messageObj.fileKey =  fileKey;
  //         }
  //         console.log("Sending message to Channel ~~~~~~~> " + channelId);
  //         firebase.database().ref('/channel/' + channelId + '/lastMessage').set(message);
  //         firebase.database().ref('/channel/' + channelId + '/lastActivity').set(lastActivity);
  //         this.db.list('/channel/' + channelId + '/messages/').push(messageObj)
  //         .then(messageSentResponse=> { 
  //           resolve(messageObj); 
  //         })
  //         .catch(errorMessage=> { reject(errorMessage) });
  //       } else{
  //         //Channel does not exist, create a new channel
  //         console.log(myUserId + " ------> " + otherUserId);
  //         this.createNewChannel(myUserId, otherUserId)
  //         .then(res=>this.sendMessage(otherUserId, message, messageType, fileKey).then(res=>resolve(res)).catch(err => reject(err)))
  //         .catch(err=> reject(err));
  //       }
  //     }, err=> reject(err));
  //   });
  // }