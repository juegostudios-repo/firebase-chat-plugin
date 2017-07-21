const firebase = require('firebase');

var getChannelIdForUser = require('./get-channelid');
var createNewChannel = require('./create-channel');

function sendMessage(otherUserId, message, channelType, messageType, fileKey)
{
  if(channelType === 'one2one')
  {
    return sendOne2OneMessage(this, otherUserId, message, messageType, fileKey)
  }
  else if(channelType === 'group')
  {
    return groupSendMessage(this, otherUserId, message, messageType, fileKey)
  }
  else
  {
    console.log("Mention channelType");
  }
}

function sendOne2OneMessage(self, otherUserId, message, messageType, fileKey)
{
  console.log("Send ONE-ONE message");
  if(!messageType){
    messageType = 'text';
  }
  return new Promise((resolve, reject)=>{
    var channelType = 'one2one';
    var channelId = getChannelIdForUser(otherUserId, self.user.channelList, channelType);
    var lastActivity = firebase.database.ServerValue.TIMESTAMP;
    if(channelId)
    {
      var time = Date.now() + self.serverTimeOffset;
      var messageObj;
      messageObj = {
        msgId: time/*firebase.database.ServerValue.TIMESTAMP*/,
        uid: self.user.uid,
        message: message,
        messageType: messageType,
        timestamp: time,
        negativetimestamp: - time
      };
      if(messageType === 'image'){
        messageObj.fileKey =  fileKey;
      }
      self.db.ref('/channel/' + channelId + '/lastActivity').set(lastActivity);
      self.db.ref('/channel/' + channelId + '/lastMessage').set(messageObj);
      self.db.ref('/channel/' + channelId + '/messages/').push(messageObj)
      .then(messageSentResponse=> { 
        /** pushing channelId to the receiver */
        pushChannelIdToReceiver(otherUserId, channelId, self);
        /** end */
        resolve(messageObj); 
      })
      .catch(errorMessage=> { reject(errorMessage) });
      
    } else{
      // Creating channel if channel does not exist;
      createNewChannel(self,self.user.uid, otherUserId)
      .then(res=> {
        self.sendMessage(otherUserId, message, messageType, fileKey)
          .then(res=>resolve(res)).catch(err => reject(err))
      })
      .catch(err=> reject(err));
      
    }
  });
}

//sending a message to the group
function groupSendMessage(self, groupId, message, messageType, fileKey)
{
  console.log("Group send message");
  if(!messageType){
    messageType = 'text';
  }
  return new Promise((resolve, reject) => {
    var channelType = 'group';
    var channelId = getChannelIdForUser(groupId, self.user.channelList, channelType);
    var lastActivity = firebase.database.ServerValue.TIMESTAMP;
    if(channelId)
    {
      console.log(channelId);
      var time = Date.now() + self.serverTimeOffset;
      var messageObj;
      messageObj = {
        msgId: time/*firebase.database.ServerValue.TIMESTAMP*/,
        uid: self.user.uid,
        message: message,
        messageType: messageType,
        timestamp: time,
        negativetimestamp: - time
      };
      if(messageType === 'image'){
        messageObj.fileKey =  fileKey;
      }
      self.db.ref('/channel/' + channelId + '/lastActivity').set(lastActivity);
      self.db.ref('/channel/' + channelId + '/lastMessage').set(messageObj);
      self.db.ref('/channel/' + channelId + '/messages/').push(messageObj)
      .then(messageSentResponse=> { 
        /** pushing channelId to the receiver */
        self.db.ref('channel/' + channelId + '/members/').once('value')
        .then(snapshot => {
          var members = snapshot.val();
          members.forEach(member => {
            if(member.uid !== self.user.uid)
              pushChannelIdToReceiver(member.uid, channelId, self);
          })
        })
        /** end */
        resolve(messageObj); 
      })
      .catch(errorMessage=> { reject({success: false, errorMessage}) });
    }
    else
    {
      reject({success: false, errMsg: "Channel does not exists."});
    }
  });
}

function pushChannelIdToReceiver(otherUserId, channelId, self)
{
  var channelObj = {
    channelId: channelId
  }
  self.db.ref('/users/' + otherUserId + '/messageReceived/').push(channelObj);
}

module.exports = sendMessage;