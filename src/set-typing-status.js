
var getChannelIdForUser = require('./get-channelid');

function setIsTypingStatus(otherUserId, typingStatus) 
{
  console.log("set Typing status");
  return new Promise((resolve, reject) => {
    var channelId = getChannelIdForUser(otherUserId, this.user.channelList);
    var members;
    var isTyping;
    if(channelId) 
    {
      this.db.ref('/channel/'+channelId).once('value').then((snapshot)=> {
          snapshot.forEach((childSnapshot) => {
            if(childSnapshot.getKey() === "members") 
            {
              members = childSnapshot.val();
            }
          });
          if(members[0].uid === this.user.uid && members[1].uid === otherUserId) {
            isTyping = typingStatus;
          }
          if(members[0].uid === otherUserId && members[1].uid === this.user.uid) {
            isTyping = typingStatus;
          }
          members.forEach((member, i) => {
            if(member.uid === this.user.uid) {
              this.db.ref('/channel/' + channelId + '/members/'+ i +'/typingIndicator').set(isTyping);
            }
          });
      });
      resolve({ success: true, successMessage: "Typing status assigned succesfully"});
    }
    else 
    {
      reject({ success: false, errorMessage: "There is no channel established"});
    }
  });
}

module.exports = setIsTypingStatus;