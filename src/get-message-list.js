var Observable =  require('rxjs/Rx').Observable;

var msgId;

function getMessageList(channelId, BeginFrom)
{
  console.log("Message list");
  return new Observable((observer) => {
    if(!channelId){ 
      observer.error({ success: false, errorMessage:" There is no channel " }) 
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
            msgId = result[result.length-1].msgId + 1;
          BeginFrom = false;
          observer.next(result);
        }
        else
        {
          //receiving the new msgs
          result = [];
          var order = 'msgId';
          this.db.ref('/channel/' + channelId + '/messages').orderByChild(order).startAt(msgId)
          .once('value', snapshot => {
            snapshot.forEach((childSnapshot) =>{
              result.push(childSnapshot.val())
            });
            if(result.length)
            {
              msgId = result[result.length-1].msgId + 1;
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