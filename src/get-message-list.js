var Observable =  require('rxjs/Rx').Observable;

var getChannelIdForUser = require('./get-channelid');
var createNewChannel = require('./create-channel');

var lastMsgId;

function getMessageList(otherUserId, channelType)
{
  return new Observable((observer) => {
    var beginFrom = true;
    var channelId = getChannelIdForUser(otherUserId, this.user.channelList, channelType);
    if(!channelId){ 
      createNewChannel(this,this.user.uid, otherUserId)
      .then(res=> {
        this.getMessageList(otherUserId, channelType)
        .subscribe(res => {
          observer.next(res);
        },err => observer.error({ success: false, errorMessage:" Could not create a new Channel " }) );
      })
      .catch(err => observer.error(err));
    }
    else {
     
      var order = 'timestamp';
      this.db.ref('/channel/' + channelId + '/messages/').orderByChild(order)
      .on('value',snapshot => {
        if(beginFrom)
        {
          //list of msgs
          var result = [];
          snapshot.forEach((childSnapshot) =>{
            result.push(childSnapshot.val())
          });
          if(result.length)
            lastMsgId = result[result.length-1].msgId + 1;
        
          beginFrom = false;
          observer.next(result);
        }
        else
        {
          //receiving the new msgs
          var result = [];
          var order = 'msgId';
          this.db.ref('/channel/' + channelId + '/messages').orderByChild(order).startAt(lastMsgId)/*.limitToLast(1)*/
          .once('value', snapshot => {
           
            snapshot.forEach((childSnapshot) =>{
              result.push(childSnapshot.val())
            });
            if(result.length)
            {
              lastMsgId = result[result.length-1].msgId + 1;
            }  
            observer.next(result);
          })
        } 
      })
    }
  });
}



module.exports = getMessageList;