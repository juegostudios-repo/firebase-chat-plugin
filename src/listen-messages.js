
var Observable =  require('rxjs/Rx').Observable;

function listenToUpdatedChannels()
{
  return new Observable((observer) => {
    var msgRef = this.db.ref('users/' + this.user.uid + '/messageReceived/');
    msgRef.on('value', snapshot => {
      var channels = [];
      snapshot.forEach((childSnapShot) => {
        channels.push(childSnapShot.val().channelId);
      });
      if(channels.length > 0)
      {
        var result = {};
        result.message = "Message Received";
        result.channelList = channels;
        deleteReadMsgs(msgRef, snapshot);
        observer.next(result); 
      }
    })
  });
}

function deleteReadMsgs(msgRef, channels) 
{
   var updates = {};
   channels.forEach((element) => {
      updates[element.key] = null;
    });
    msgRef.update(updates);
}

module.exports = listenToUpdatedChannels;