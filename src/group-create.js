const firebase = require('firebase');
var getChannelIdForUser = require('./get-channelid');

//creating new group
function groupCreate(grpId, grpName, grpProfilePic)
{
  return new Promise((resolve, reject) => {
    checkGroupId(this, grpId)
    .then(res => {
      var user = {
        uid: this.user.uid,
      }
      var member_one = {
        user: user
      };
      
      var key = this.db.ref().push().key;
      var channelId = key;
      //adding group info
      var groupInfo = {
        groupId: grpId,
        groupName: grpName ? grpName : "group "+ grpId,
        groupPic: grpProfilePic ? grpProfilePic : ' '
      }
      var member = [member_one.user];
      var channelName = "group";
      var createdAt = Date.now() + this.serverTimeOffset;
      addToChannelList(this, this.user.uid, channelId, grpId);
      createChannelCollection(this, member, channelId, createdAt, channelName, groupInfo)
      .then(grpDetails => {
        resolve({status: true, responseMessage: {message: "Channel created", channelId: channelId, grpDetails: grpDetails.grpInfo}});
      })
      .catch(err => reject(err));
    })
    .catch(err => {
      reject(err);
    });
    
  })
}

//adding new members to the existing group
function groupAddMember(userId, grpId)
{
  console.log("grp add member");
  return new Promise((resolve, reject) => {
    if(userId === this.user.uid)
    {
      reject({succes: false, errMsg: "UserID " + userId + " already present in the group."});
    }
    else
    {
      var channelType = 'group';
      var channelId = getChannelIdForUser(grpId, this.user.channelList, channelType);
      if(channelId)
      {
        console.log("channel ID::", channelId);
        getUserDetailsWithNoGrpID(this, userId, grpId)
        .then((data) => {
          if(data)
          {
            var member = [];
            member.push(data.user);
            addToChannelList(this, userId, channelId, grpId);
            var channelRef = this.db.ref('channel/' + channelId + '/members/');
            channelRef.once('value')
            .then(snapshot => {
              var result = snapshot.val();
              result = result.concat(member);
              addToExistingChannel(channelRef, result);
              resolve({status: true, responseMessage: {message: "Member added", channelId: channelId}});
            })
          }
        })
        .catch((err) => reject(err));
      }
      else
      {
        reject({succes: false, errMsg: "Channel does not exists."});
      }
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
          var m = [];
          m = snapshot.val();
          if(m.length === 1 )
          {
            var deleteChannelRef = this.db.ref('channel/' + channelId);
            deleteChannelRef.remove();
          }
          else
          {
            var result = [];
            var members = snapshot.val();
            members.forEach(member => {
              if(member.uid !== this.user.uid)
              {
                result = result.concat({uid: member.uid});
              }
            })
            addToExistingChannel(channelRef, result);
          }
        })
        resolve({success: true, responseMsg: "Group " + groupId + " deleted from your channelList."});
      }
      else
      {
        reject({success: false, errMsg: "Group " + groupId + " doesn't exists."});
      }
    })
    .catch(err => reject({success: false, errMsg: "Group " + groupId + " doesn't exists."}));
  });
}

//get group information
function checkGroupId(self, groupId)
{
  console.log("getGroupInfo");
  return new Promise((resolve, reject) => {
    self.db.ref('channel/').orderByChild('groupId').equalTo(groupId).once('value')
    .then((res) => {
      if(res.val())
      {
        reject({success: false, errMsg: "GroupID " + groupId + " already exists."});
      }
      else
      {
        resolve({success: true, successMsg: "GroupID " + groupId + " is unique."});
      }
    })
  .catch(err => {
    reject({success: false, errMsg: "Something went wrong. Please try again."});
  })

  });
}

function getUserDetailsWithNoGrpID(self, userId, grpId)
{
  return new Promise((resolve, reject)=>{
    var usersRef = self.db.ref('/users/' + userId);
    usersRef.once('value')
    .then((snapshot) => {         
      if(snapshot.val())
      {
        var userChannelRef = self.db.ref('/users/' + userId + '/channelList/').orderByChild('groupId').equalTo(grpId)
        .once('value')
        .then(res => {
          if(res.val())
          {
            reject({success: false, errMsg: "UserID " + userId + " already present in the group."});
          }
          else
          {
            var user = {
              uid: snapshot.val().uid,
            }
            resolve({ user: user });
          } 
        })
        .catch(err => reject({success: false, errMsg: "UserID " + userId + " already present in the group."}));
        
      } 
      else
      {
        reject({success: false, errMsg: "User " + userId + " doesn't exists."})
      } 
    }, 
    err=> {reject({success: false, errMsg: "User " + userId + " doesn't exists."})});
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
    err=> {reject({success: false, errMsg: "User " + userId + " doesn't exists."})});
  });
}

function createChannelCollection(self, members, channelId, createdAt, channelName, groupInfo)
{
  return new Promise((resolve, reject) => {
    var channel = {
      channelName: channelName,
      members: members,
      createdAt: createdAt,
      groupId: groupInfo.groupId,
      groupName: groupInfo.groupName,
      groupPic: ' ',
      lastActivity: firebase.database.ServerValue.TIMESTAMP
    };
    self.db.ref('/channel/' + channelId).set(channel)
    .then(res => {
      var grpInfo = {
        groupId: groupInfo.groupId,
        groupName: groupInfo.groupName,
        groupPic: ' ',
        channelType: channelName
      };
      if(groupInfo.groupPic !== ' ')
      {
        self.updateProfilePic(groupInfo.groupPic, 'group', groupInfo.groupId)
        .then(res => {
          grpInfo.groupPic = res.fileKey;
          resolve({grpInfo});
        })
        .catch(err => resolve({grpInfo}));
      }
      else
      {
        resolve({grpInfo});
      }
    })
    .catch(err => reject({success: false, errMsg: "Channel creation failed. "}));
  });
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

exports.grpFeature = { groupCreate, groupAddMember, groupDelete };
