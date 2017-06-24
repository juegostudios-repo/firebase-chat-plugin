const firebase = require('firebase');

var Observable =  require('rxjs/Rx').Observable;
var getChannelIdForUser = require('./get-channelid');

function setOnlineStatus()
{
  var lastSeenAt = true;
  userRef = this.db.ref('/users/' + this.user.uid + '/' + this.user.$key + '/lastSeenAt');
  userRef.set(lastSeenAt);
  userRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
}

function getOnlineStatus(otherUserId)
{
  return new Observable((observer)=>{   
    this.db.ref('/users/' + otherUserId).once('value').then(result => {
      var key;
      result.forEach(childKey => {
        key = childKey.getKey()
      })
      if(key)
      {
        this.db.ref('/users/' + otherUserId + '/' + key )
        .on('value', res => {
          var result = res.val();
          var lastSeen = result.lastSeenAt;
          var onlineStatusResponse ={ };
          if(lastSeen)
          {
            onlineStatusResponse.uid = otherUserId;
            onlineStatusResponse.isOnline = lastSeen
          }
          observer.next(onlineStatusResponse);
        })
      }
      else
      {
        observer.error({success: false, errMsg: "No user exists"});
      }
    });
  });
}

exports.onlineStatus = { getOnlineStatus, setOnlineStatus };