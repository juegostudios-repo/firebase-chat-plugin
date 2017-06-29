var Observable =  require('rxjs/Rx').Observable;

var getChannelIdForUser = require('./get-channelid');
var createNewChannel = require('./create-channel');

var lastMsgId;

function getMessageList(otherUserId, BeginFrom)
{
 
  return new Observable((observer) => {

    var channelId = getChannelIdForUser(otherUserId, this.user.channelList);

    if(!channelId){ 
      createNewChannel(this,this.user.uid, otherUserId)
      .then(res=> {
       
        this.getMessageList(otherUserId, BeginFrom)
        .subscribe(res => {
         
          observer.next(res);
        },err => console.log(err));
      })
     //observer.error({ success: false, errorMessage:" There is no channel " }) 
    }
    else {
      var order = 'timestamp';
      this.db.ref('/channel/' + channelId + '/messages/').orderByChild(order)
      .on('value',snapshot => {
      

        if(BeginFrom)
        {
          //list of msgs
          result = [];
          snapshot.forEach((childSnapshot) =>{
            result.push(childSnapshot.val())
          });
          if(result.length)
            lastMsgId = result[result.length-1].msgId + 1;
        
          BeginFrom = false;
          observer.next(result);
        }
        else
        {
          //receiving the new msgs
          result = [];
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

// function saveToCache(channelId, messages, flag) 
// {
//   if(messages.length)
//   {
//     var messageList = messages;
//     var cacheValue = localStorage.getItem(channelId);
//     cacheValue = JSON.parse(cacheValue);

//     if(!flag)
//     {
//       if(messages.length > 10)
//       {
//         messageList = messageList.slice(messageList.length-10);
//       }
//       localStorage.setItem(channelId, JSON.stringify(messageList));
//     }
//     else
//     {
//       if(cacheValue.length === 10)
//       {
//         cacheValue.shift();
//       }
//       cacheValue.push(messageList);
//       localStorage.setItem(channelId, JSON.stringify(cacheValue));
//     }

//   }
// }

module.exports = getMessageList;