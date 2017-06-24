function getChannelIdForUser(userId, channelList)
{
  var channelId;
  if(!channelList)
    return channelId
  if(channelList.constructor !== Array){
    // var members = channelList.members;
    // members.forEach(member => {
    //   if(member.uid === userId && members.length === 2)
    //   {
    //     channelId = channelList.channelId;
    //   }
    // })
    // return channelId;
    channelList = Object.keys(channelList).map(key=> {
      channelList[key]});
      
  }
  
  channelList.forEach(channel => {
    channel.members.forEach(member => {
      if(member.uid === userId && channel.members.length === 2)
      {
        channelId = channel.channelId;
      }
    });
  });
  return channelId;
}

module.exports = getChannelIdForUser;