const firebase = require('firebase');

function createNewChannel(self, myUId, otherUserId)
{
  return new Promise((resolve, reject) => {
    var user = {
      uid: self.user.uid,
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
        addToChannelList(self, myUId, member_one.key, channelId, otherUserId)
        .then((_)=>{
          return addToChannelList(self, otherUserId, member_two.key, channelId, myUId)
        })
        .then(res=>{ 
          createChannelCollection(self, members, channelId, createdAt, channelName);
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
    
    var usersRef = self.db.ref('/users/' +userId).orderByChild('uid').equalTo(userId).limitToLast(1);
    
    usersRef.once('value')
    .then((snapshot) => {         
      if(snapshot.val()){
        snapshot.forEach((childSnapshot) => { 
          var user = {
            uid: childSnapshot.val().uid,
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

function createChannelCollection(self, members, channelId, createdAt, channelName)
{
  var channel = {
    channelName: channelName,
    members: members,
    createdAt: createdAt
  };
  self.db.ref('/channel/' + channelId).set(channel);
 
}

function addToChannelList(self, userId, key, channelId, memberId)
{
  return self.db.ref('/users/'+ userId + '/' + key + '/channelList').push({
    channelId: channelId,
    member: memberId
  });
} 

module.exports = createNewChannel;