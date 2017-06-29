const firebase = require('firebase');

var Observable =  require('rxjs/Rx').Observable;
var getChannelIdForUser = require('./get-channelid');

function setOnlineStatus()
{
  var  lastSeenAt = firebase.database.ServerValue.TIMESTAMP;
  var userRef = this.db.ref('/users/' + this.user.uid + '/' + this.user.$key + '/lastSeenAt');
  userRef.set(lastSeenAt);
  // userOnline.onConnect().set(true);
}

function getOnlineStatus(otherUserId)
{
  return new Observable((observer)=>{
    setInterval(()=>{   
      this.db.ref('/users/' + otherUserId).once('value').then(result => {
        var key;
        result.forEach(childKey => {
          key = childKey.getKey()
        })
        if(key)
        {
          this.db.ref('/users/' + otherUserId + '/' + key + '/lastSeenAt/' )
          .once('value', res => {
            var result = res.val();
            var lastSeen = result;
            var onlineStatusResponse ={ };
            onlineStatusResponse.uid = otherUserId;
            onlineStatusResponse.isOnline = (new Date().getTime() + this.serverTimeOffset - lastSeen) < 10000 ? true : false;
          
            observer.next(onlineStatusResponse);
          })
        }
        else
        {
          observer.error({success: false, errMsg: "No user exists"});
        }
      });
    }, 10000);
  });
}

exports.onlineStatus = { getOnlineStatus, setOnlineStatus };