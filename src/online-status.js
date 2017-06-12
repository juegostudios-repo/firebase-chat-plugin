const firebase = require('firebase');

var Observable =  require('rxjs/Rx').Observable;
var getChannelIdForUser = require('./get-channelid');

function setOnlineStatus()
{
  var channels = this.user.channelList;
  var index = 0;
  var lastSeenAt;

  if(channels.constructor !== Array){
    channels = Object.keys(channels).map(key=> channels[key]);
  }
  if(channels.length < 1) return;
  
  channels.forEach((channel)=>{
    var members = channel.members;
    members.forEach((member, i) => {
      if(member.uid === this.user.uid){
        index = i;    
      }
    });
    lastSeenAt = firebase.database.ServerValue.TIMESTAMP;

    this.db.ref('/channel/' + channel.channelId + '/members/'+ index +'/lastSeenAt').set(lastSeenAt);
  });
}

function getOnlineStatus(otherUserId)
{
  return new Observable((observer)=>{    
    var channelId = getChannelIdForUser(otherUserId, this.user.channelList);
    if(!channelId){ 
      observer.error({ success: false, errorMessage:" There is no channel " }) 
    }
    else{
      getOnlineStatusByChannelId(this, channelId).subscribe(res => { observer.next(res) }, err=> observer.error(err));
    }
  });
}

function getOnlineStatusByChannelId(self, channelId)
{
  return new Observable((observer)=>{  
    self.db.ref('/channel/' + channelId)
    .on('value', res=>{ 
      
      res = res.val();
      var members = res.members;
      var onlineStatusResponse ={ };
      
      members.forEach((member, i)=>{
        if(member.uid !== self.user.uid)
        {
          onlineStatusResponse.isOnline = (new Date().getTime() + self.serverTimeOffset - member.lastSeenAt) < 10000 ? true : false;
          onlineStatusResponse.uid = member.uid;
        }
      });
      observer.next(onlineStatusResponse);
    });
  });
}

exports.onlineStatus = { getOnlineStatus, setOnlineStatus };