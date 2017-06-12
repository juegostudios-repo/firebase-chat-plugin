const firebase = require('firebase');

function createNewChannel(self, myUId, otherUserId)
{
  return new Promise((resolve, reject) => {
    var user = {
      uid: self.user.uid,
      displayName: self.user.displayName, 
      displayPhoto: self.user.displayPhoto,
    }
    var member_one = {
      user: user
    };
    member_one.key = self.user.$key;
    
    getUserDetails(self, otherUserId)
    .then((member)=> { 
      if(!member){ 
        reject({status: false, message: otherUserId + " User Does not exist"}); 
      } else{
        
        var member_two = member;
        var key = self.db.ref().push().key;
        var channelId = key; 
        var members = [member_one.user, member_two.user]
        
        // Add this newly created channel to both users channel list
        var channelName = "one2one";
        var createdAt = Date.now() + self.serverTimeOffset;
        console.log(JSON.stringify(members, undefined, 2));
        addToChannelList(self, members, member_one.key, channelId, channelName, createdAt)
        .then((_)=>{
          return addToChannelList(self, members, member_two.key, channelId, channelName, createdAt)
        })
        .then(res=>{ 
          createChannelCollection(self, members, channelId, createdAt);
          resolve({status: true, responseMessage: {message: "Channel created", channelId: channelId}});
        })
        .catch(err=> reject(err));
      }
    });
  });
}

function getUserDetails(self, userId)
{
  return new Promise((resolve, reject)=>{
    
    var usersRef = self.db.ref('/users').orderByChild('uid').equalTo(userId).limitToLast(1);
    
    usersRef.once('value')
    .then((snapshot) => {         
      if(snapshot.val()){
        snapshot.forEach((childSnapshot) => { 
          var user = {
            uid: childSnapshot.val().uid,
            displayName: childSnapshot.val().displayName, 
            displayPhoto: childSnapshot.val().displayPhoto
          }
          resolve({ user: user, key: childSnapshot.getKey() });
        });
      } else{
        resolve(null);
      } 
    }, 
    err=> reject(err));
  });
}

function createChannelCollection(self, members, channelId, createdAt)
{
  members[0].lastSeenAt = firebase.database.ServerValue.TIMESTAMP;

  var channel = {
    members: members,
    createdAt: createdAt
  };
  self.db.ref('/channel/' + channelId).set(channel);
}

function addToChannelList(self,members, key, channelId, channelName, createdAt)
{
  return self.db.ref('/users/'+ key + '/channelList').push({
    members: members,
    channelId: channelId,
    channelName: channelName,
    createdAt: createdAt
  });
}

module.exports = createNewChannel;