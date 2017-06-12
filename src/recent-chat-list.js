
function getRecentChatList() 
{
  console.log("get-Recent-Chat-List");
  var userChannels = this.user.channelList;
  var channels = Object.keys(userChannels).map(key=> userChannels[key]);
  var allChannelList;
  var channelList = [];
  return new Promise((resolve, reject) =>{
    getAllChannelLists(this).then(res => {
      allChannelList = res;
      allChannelList.forEach(channel => {
        channels.forEach(userChannel => {
          if( userChannel.channelId === channel.key) {
            delete channel.value.messages;
            channelList.push(channel.value);
          }
        });
      });
      resolve(channelList);
    })
    
  });
}

function getAllChannelLists(self) 
{
  var result = [];
  return new Promise((resolve, reject) => {
    self.db.ref('/channel/').orderByChild('lastActivity').once('value').then((snapshot)=> {
      if(snapshot) {
        snapshot.forEach((childSnapshot) => {
             result.push({key: childSnapshot.getKey(),value: childSnapshot.val()});
        });
        result = result.reverse();
        resolve(result);
      }
      else 
        reject("no Channels");
    });
  }); 
}

module.exports = getRecentChatList;