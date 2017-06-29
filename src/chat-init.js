const firebase = require('firebase');

function initChat (userId, displayName, displayPhoto)
{
  var offsetRef = this.db.ref(".info/serverTimeOffset");
  offsetRef.once("value", (snap)=> {
    this.serverTimeOffset = snap.val();
  });

  const userRef = this.db.ref('users/' +userId);
  return new Promise((resolve, reject)=>{
    userRef.orderByChild('uid').equalTo(userId).limitToLast(1).once('value')
    .then((snapshot) => {         
      if(snapshot.val()){
        snapshot.forEach((childSnapshot) => {
          this.user = childSnapshot.val();
          this.user.$key = childSnapshot.getKey();
          if(displayPhoto)
          {
            this.updateProfilePic(displayPhoto);
          }
          if(displayName)
          {
            this.db.ref('users/' +userId + '/'+ this.user.$key + '/displayName').set(displayName);
            this.user.displayName = displayName;
          }
          listenToChannelListUpdate(this) 
          resolve(this.user);  
        });
      } else{
        lastSeenAt = firebase.database.ServerValue.TIMESTAMP;
        var user={
          uid: userId,
          displayName: displayName ? displayName: "User " + userId,
          lastSeenAt: lastSeenAt
        };
        if(!displayPhoto)
        {
          user.displayPhoto= " ";
        }
        userRef.push(user)
        .then((pushResponse) => {
          user.$key = pushResponse.key;
          this.user = user;
          if(displayPhoto)
          {
            this.updateProfilePic(displayPhoto);
          }
          listenToChannelListUpdate(this);
          resolve(user);
        })
        .catch(err=> reject(err));
      }
    })
    .catch(err=> reject(err));
  });
}

function listenToChannelListUpdate(self)
{
  
  self.db.ref('/users/'+ self.user.uid + '/' + self.user.$key + '/channelList')
  .on("value", (snap)=> {
  
    self.user.channelList = [];
    snap.forEach(childSnap => {
      self.user.channelList.push(childSnap.val());
    })
  });
  setInterval(()=> 
  {
    self.setOnlineStatus();
  } , 10000);
}

module.exports = initChat;