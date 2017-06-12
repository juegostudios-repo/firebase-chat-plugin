var Observable =  require('rxjs/Rx').Observable;
var getChannelIdForUser = require('./get-channelid');

function getIsTypingStatus(otherUserId) 
{
  console.log("get Typing status");
  return new Observable((observer) => {
    var channelId = getChannelIdForUser(otherUserId, this.user.channelList);
    if(channelId) 
    {
      this.db.ref('/channel/'+channelId).on('value',(snapshot)=> {
          snapshot.forEach((childSnapshot) => {
            if(childSnapshot.getKey() === "members") 
            {
              members = childSnapshot.val();
            }
          });
          members.forEach((member) => {
            if(member.uid === otherUserId) {
              if(member.typingIndicator)
                var result = { success: true, typingIndicator: member.typingIndicator };
              else
                var result = { success: false, errorMessage:" There is no typing indicator set" };
              observer.next(result);
            }
          });
      });
    }
    else 
    {
      observer.error({ success: false, errorMessage:" There is no channel " }) 
    }
  });
}

module.exports = getIsTypingStatus;