function getChannelIdForUser(userId, channelList, channelType)
{
  
  var channelId;
  if(!channelList)
    return channelId
  if(channelList.constructor !== Array){
    channelList = Object.keys(channelList).map(key=> {
      channelList[key]}); 
  }
  
  channelList.forEach(channel => {
    if(channel.member === userId && channel.channelType === channelType)
    {
      channelId = channel.channelId;
    }
    else if(channel.groupId === userId && channel.channelType === channelType)
    {
      channelId = channel.channelId;
    }
  });
  
  return channelId;
}

module.exports = getChannelIdForUser;


