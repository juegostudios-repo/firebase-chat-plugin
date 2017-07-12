const firebase = require('firebase');
var getChannelIdForUser = require('./get-channelid');

//creating new group
function groupCreate(userIds, grpId, grpName, grpProfilePic)
{
  return new Promise((resolve, reject) => {
    var user = {
      uid: this.user.uid,
    }
    var member_one = {
      user: user
    };
    var members = [member_one.user];
    var key = this.db.ref().push().key;
    var channelId = key;
    

    //adding group info
    var groupInfo = {
      groupId: grpId,
      groupName: grpName ? grpName : "group "+ grpId,
      groupPic: ' '
    }

    if(userIds)
    {
      userIds.forEach((userId, i) => {
        getUserDetails(this, userId)
        .then((member) => {
          if(!member)
          {
            reject({status: false, message: userId + " User Does not exist"}); 
          }
          else
          {
            var otherMember = member.user;
            members = members.concat(otherMember);
            addToChannelList(this, userId, channelId, grpId);
            if((userIds.length-1) === i)
            {
              var channelName = "group";
              var createdAt = Date.now() + this.serverTimeOffset;
              addToChannelList(this, this.user.uid, channelId, grpId);
              createChannelCollection(this, members, channelId, createdAt, channelName, groupInfo);
              resolve({status: true, responseMessage: {message: "Channel created", channelId: channelId}});
            }
          }
        })
      });
    }
    else
    {
      reject({success: false, errMsg: "Atleast one member is must"});
    }
  })
}

//adding new members to the existing group
function groupAddMember(userIds, grpId)
{
  return new Promise((resolve, reject) => {
    console.log("Group Add Member");
    this.db.ref('users/' + this.user.uid + '/channelList/').orderByChild('groupId').equalTo(grpId)
    .once('value').then(snapshot => {
      if(snapshot.val())
      {
        var channelId;
        var members = [];
        snapshot.forEach((childSnapshot) =>{
         channelId = childSnapshot.val().channelId;
        });
        if(channelId)
        {
          console.log("channelId:: ",channelId);
          if(userIds)
          {
            userIds.forEach((userId, i) => {
              getUserDetails(this, userId)
              .then((member) => {
                if(!member)
                {
                  reject({status: false, message: userId + " User Does not exist"}); 
                }
                else
                {
                  var otherMember = member.user;
                  members = members.concat(otherMember);
                  addToChannelList(this, userId, channelId, grpId);
                  if((userIds.length-1) === i)
                  {
                    var channelRef = this.db.ref('channel/' + channelId + '/members/');
                    channelRef.once('value')
                    .then(snapshot => {
                      var result = snapshot.val();
                      result = result.concat(members);
                      addToExistingChannel(channelRef, result);
                      resolve({status: true, responseMessage: {message: "Members added", channelId: channelId}});
                    })
                  }
                }
              })
            });
          }
          else
          {
            reject({succes: false, errMsg: "Atleast one member is must"});
          }
        }
        else
        {
          reject({succes: false, errMsg: "Channel does not exists."});
        }
      }
      else
      {
        reject({succes: false, errMsg: grpId + " Group doesn't exists in your channel"});
      }
    })
  })
}

//sending a message to the group
function groupSendMessage(groupId, message, messageType, fileKey)
{
  console.log("Group send message");
  if(!messageType){
    messageType = 'text';
  }
  return new Promise((resolve, reject) => {
    var channelType = 'group';
    var channelId = getChannelIdForUser(groupId, this.user.channelList, channelType);
    var lastActivity = firebase.database.ServerValue.TIMESTAMP;
    if(channelId)
    {
      console.log(channelId);
      var time = Date.now() + this.serverTimeOffset;
      var messageObj;
      messageObj = {
        msgId: time/*firebase.database.ServerValue.TIMESTAMP*/,
        uid: this.user.uid,
        message: message,
        messageType: messageType,
        timestamp: time,
        negativetimestamp: - time
      };
      if(messageType === 'image'){
        messageObj.fileKey =  fileKey;
      }
      this.db.ref('/channel/' + channelId + '/lastActivity').set(lastActivity);
      this.db.ref('/channel/' + channelId + '/lastMessage').set(messageObj);
      this.db.ref('/channel/' + channelId + '/messages/').push(messageObj)
      .then(messageSentResponse=> { 
        /** pushing channelId to the receiver */
        this.db.ref('channel/' + channelId + '/members/').once('value')
        .then(snapshot => {
          var members = snapshot.val();
          members.forEach(member => {
            if(member.uid !== this.user.uid)
              pushChannelIdToReceiver(member.uid, channelId, this);
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


//delete a group
function groupDelete(groupId)
{
  console.log("delete group");
  return new Promise((resolve, reject) => {
    var userRef = this.db.ref('users/' + this.user.uid + '/channelList/');
    userRef.orderByChild('groupId').equalTo(groupId).once('value')
    .then(snapshot => {
      if(snapshot.val())
      {
        var channelId;
        snapshot.forEach(childsnapshot => {
          channelId = childsnapshot.val().channelId;
        })
        deleteChannel(this ,userRef, snapshot);
        var channelRef = this.db.ref('channel/' + channelId + '/members/');
        channelRef.once('value')
        .then(snapshot => {
          var result = [];
          var members = snapshot.val();
          members.forEach(member => {
            if(member.uid !== this.user.uid)
            {
              result = result.concat({uid: member.uid});
            }
          })
          addToExistingChannel(channelRef, result);
        })
        resolve({success: true, responseMsg: "Group " + groupId + " deleted from your channelList."});
      }
      else
      {
        reject({success: false, errMsg: "Group " + groupId + " doesn't exists."});
      }
    })
  });
}

function getUserDetails(self, userId)
{
  return new Promise((resolve, reject)=>{
    var usersRef = self.db.ref('/users/' +userId);
    usersRef.once('value')
    .then((snapshot) => {         
      if(snapshot.val()){
        var user = {
          uid: snapshot.val().uid,
        }
        resolve({ user: user });
      } else{
        resolve(null);
      } 
    }, 
    err=> reject(err));
  });
}

function createChannelCollection(self, members, channelId, createdAt, channelName, groupInfo)
{
  var channel = {
    channelName: channelName,
    members: members,
    createdAt: createdAt,
    groupId: groupInfo.groupId,
    groupName: groupInfo.groupName,
    groupPic: groupInfo.groupPic,
    lastActivity: firebase.database.ServerValue.TIMESTAMP
  };
  self.db.ref('/channel/' + channelId).set(channel);
 
}

function addToChannelList(self, userId, channelId, groupId)
{
  self.db.ref('/users/'+ userId + '/channelList').push({
    channelId: channelId,
    channelType: 'group',
    groupId: groupId
  });
} 

function addToExistingChannel(channelRef, members)
{
  channelRef.set(members);
}

function pushChannelIdToReceiver(otherUserId, channelId, self)
{
  var channelObj = {
    channelId: channelId
  }
  self.db.ref('/users/' + otherUserId + '/messageReceived/').push(channelObj);
}

function deleteChannel(self, channelRef, channelDetail) 
{
   var updates = {};
   channelDetail.forEach((element) => {
      updates[element.key] = null;
    });
    channelRef.update(updates);
}

exports.grpFeature = { groupCreate, groupAddMember, groupSendMessage, groupDelete};
