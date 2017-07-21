const firebase = require('firebase');

function initChat (userId, displayName, displayPhoto)
{
  var offsetRef = this.db.ref(".info/serverTimeOffset");
  offsetRef.once("value", (snap)=> {
    this.serverTimeOffset = snap.val();
  });

  const userRef = this.db.ref('users/' +userId);
  return new Promise((resolve, reject)=>{
    userRef.once('value')
    .then((snapshot) => {         
      if(snapshot.val()){
        this.user = snapshot.val();
        if(displayPhoto)
        {
          this.updateProfilePic(displayPhoto, 'one2one');
        }
        if(displayName)
        {
          this.db.ref('users/' +userId + '/displayName').set(displayName);
          this.user.displayName = displayName;
        }
        listenToChannelListUpdate(this) 
        resolve(this.user);  
      } 
      else 
      {
        var lastSeenAt = firebase.database.ServerValue.TIMESTAMP;
        var user={
          uid: userId,
          displayName: displayName ? displayName: "User " + userId,
          lastSeenAt: lastSeenAt
        };
        userRef.set(user)
        .then((pushResponse) => {
          this.user = user;
          if(displayPhoto)
          {
            this.updateProfilePic(displayPhoto, 'one2one');
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
  
  self.db.ref('/users/'+ self.user.uid + '/channelList')
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