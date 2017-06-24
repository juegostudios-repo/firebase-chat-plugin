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
          getUserChannels(this).then (res =>{
            this.user.channelList = res;
            resolve(this.user);
          });
          listenToChannelListUpdate(this) 
          
        });
      } else{
        lastSeenAt = firebase.database.ServerValue.TIMESTAMP;
        var user={
          uid: userId,
          displayName: displayName ? displayName: "User " + userId,
          displayPhoto: displayPhoto ? displayPhoto : " ",
          lastSeenAt: lastSeenAt
        };
        userRef.push(user)
        .then((pushResponse) => {
          user.$key = pushResponse.key;
          this.user = user;
          getUserChannels(this).then (res =>{
            this.user.channelList = res;
            resolve(user);
          });
          listenToChannelListUpdate(this);
          
        })
        .catch(err=> reject(err));
      }
    })
    .catch(err=> reject(err));
  });
}
function getUserChannels(self)
{
  var result = [];
  return new Promise((resolve, reject) => {
    self.db.ref('/channel/').orderByChild('members/0/uid').equalTo(self.user.uid).once("value")
  .then(snapShot => {
    snapShot.forEach(childSnapshot => {
      result.push({
        channelId: childSnapshot.getKey(),       
        members: childSnapshot.val().members
      })
    })
    self.db.ref('/channel/').orderByChild('members/1/uid').equalTo(self.user.uid).once("value")
    .then(snapShot => {
      if(snapShot.val() !== null)
      {
        snapShot.forEach(childSnapshot => {
          result.push({
            channelId: childSnapshot.getKey(),  
            members: childSnapshot.val().members
          })
        });
      }
      resolve(result);
    });
  }); 
  })
}


function listenToChannelListUpdate(self)
{
  console.log("listenToChannelListUpdate");
  self.db.ref('/users/'+ self.user.uid + '/' + self.user.$key + '/channelList')
  .on("value", (snap)=> {
    getUserChannels(self).then(res => {
      self.user.channelList = res;
    });
  });
  // setInterval(()=>{self.setOnlineStatus()}, 10000);
  self.setOnlineStatus();
}

module.exports = initChat;