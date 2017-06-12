
function getRecentChatList() 
{
  console.log("get-Recent-Chat-List");
  return new Promise((resolve, reject) =>{
    var userChannels = this.user.channelList;
    if(userChannels)
    {
      var channels = Object.keys(userChannels).map(key=> userChannels[key]);
      var allChannelList;
      var channelList = [];
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
    }
    else
    {
      reject({ success: false, errorMessage: "No Channels exists"});
    }
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
        reject({ success: false, errorMessage: "No Channels exists"});
    });
  }); 
}

module.exports = getRecentChatList;