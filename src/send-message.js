const firebase = require('firebase');

var getChannelIdForUser = require('./get-channelid');
var createNewChannel = require('./create-channel');

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
        msgId: firebase.database.ServerValue.TIMESTAMP,
        uid: this.user.uid,
        message: message,
        messageType: messageType,
        timestamp: time,
        negativetimestamp: - time
      };
      if(messageType === 'image'){
        messageObj.fileKey =  fileKey;
      }
      
      this.db.ref('/channel/' + channelId + '/lastMessage').set(messageObj);
      this.db.ref('/channel/' + channelId + '/lastActivity').set(lastActivity);
      this.db.ref('/channel/' + channelId + '/messages/').push(messageObj)
      .then(messageSentResponse=> { 
        console.log("came here");
        /** pushing channelId to the receiver */
        pushChannelIdToReceiver(otherUserId, channelId, this);
        /** end */
        resolve(messageObj); 
      })
      .catch(errorMessage=> { reject(errorMessage) });
       
    } else{
      console.log("Channel Does not exist");
      // Creating channel if channel does not exist;
      createNewChannel(this,this.user.uid, otherUserId)
      .then(res=> {
        this.sendMessage(otherUserId, message, messageType, fileKey)
          .then(res=>resolve(res)).catch(err => reject(err))
      })
      .catch(err=> reject(err));
      
    }
  });
}

function pushChannelIdToReceiver(otherUserId, channelId, self)
{
  self.db.ref('/users/' + otherUserId).once('value').then(result => {
    var key;
    result.forEach(childKey => {
      key = childKey.getKey()
    })
    var channelObj = {
      channelId: channelId
    }
    self.db.ref('/users/' + otherUserId + '/' + key + '/messageReceived/').push(channelObj);
  })
}

module.exports = sendMessage;