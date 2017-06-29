function getChannelIdForUser(userId, channelList)
{
  
  var channelId;
  if(!channelList)
    return channelId
  if(channelList.constructor !== Array){
    channelList = Object.keys(channelList).map(key=> {
      channelList[key]}); 
  }
  
  channelList.forEach(channel => {
    if(channel.member === userId)
    {
      channelId = channel.channelId;
    }
  });
 
  return channelId;
}

module.exports = getChannelIdForUser;


