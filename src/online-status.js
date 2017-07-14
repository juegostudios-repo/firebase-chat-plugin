const firebase = require('firebase');

var Observable =  require('rxjs/Rx').Observable;
var getChannelIdForUser = require('./get-channelid');

function setOnlineStatus()
{
  var  lastSeenAt = firebase.database.ServerValue.TIMESTAMP;
  var userRef = this.db.ref('/users/' + this.user.uid + '/lastSeenAt');
  userRef.set(lastSeenAt);
  // userOnline.onConnect().set(true);
}

function getOnlineStatus(otherUserId)
{
  return new Observable((observer)=>{
    setInterval(()=>{   
      this.db.ref('/users/' + otherUserId + '/lastSeenAt/').once('value').then(result => {
        if(result.val())
        {
          var lastSeen = result.val();
          var onlineStatusResponse ={ };
          onlineStatusResponse.uid = otherUserId;
          onlineStatusResponse.isOnline = (new Date().getTime() + this.serverTimeOffset - lastSeen) < 10000 ? true : false;
          observer.next(onlineStatusResponse);
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