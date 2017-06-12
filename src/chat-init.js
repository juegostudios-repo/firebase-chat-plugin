function initChat (userId, displayName, displayPhoto)
{
  var offsetRef = this.db.ref(".info/serverTimeOffset");
  offsetRef.once("value", (snap)=> {
    this.serverTimeOffset = snap.val();
  });

  const userRef = this.db.ref('users/');
  return new Promise((resolve, reject)=>{
    userRef.orderByChild('uid').equalTo(userId).limitToLast(1).once('value')
    .then((snapshot) => {         
      if(snapshot.val()){
        snapshot.forEach((childSnapshot) => {
          this.user = childSnapshot.val();
          this.user.$key = childSnapshot.getKey();
          listenToChannelListUpdate(this) 
          resolve(this.user);
        });
      } else{
        var user={
          uid: userId,
          displayName: displayName ? displayName: "User " + userId,
          displayPhoto: displayPhoto ? displayPhoto : " "
        };
        userRef.push(user)
        .then((pushResponse) => {
          user.$key = pushResponse.key;
          this.user = user;
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
  self.db.ref('/users/'+self.user.$key + '/channelList')
  .on("value", (snap)=> {
    console.log("Channel list updated");
    self.user.channelList = snap.val();
  });
}

module.exports = initChat;