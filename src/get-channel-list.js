var Observable =  require('rxjs/Rx').Observable;

var flag = false;
// var dbRef = this.db.ref('/users/' + this.user.uid + '/' + this.user.$key + '/messageReceived/');

function getChannelList()
{
  console.log("--getChannelList--");
  return new Promise((resolve, reject) => {
    this.db.ref('/users/' + this.user.uid + '/' + this.user.$key + '/channelList/')
    .once('value').then((snapshot) => {
      if(snapshot.val())
      {
        var userChannels = [];
        snapshot.forEach((childSnapshot) => {
          userChannels.push(childSnapshot.val());
        })
        this.db.ref('/channel/').orderByChild('lastActivity')
        .once('value').then((snapshot)=> {
          var allChannels = [];
          snapshot.forEach((childSnapshot) => {
            allChannels.push({key: childSnapshot.getKey()});
          });
          var result = [];
          allChannels.forEach(channel => {
            userChannels.forEach(userChannel => {
              if(userChannel.channelId === channel.key)
              {
                result.push(userChannel);
              }
            })
          })
          result = result.reverse();
          resolve(result);
        });
      }
      else
      {
        reject({ success: false, errMsg: "No Channel exists"});
      }
    })    
  });
}

// function listenToUpdatedChannels()
// {
//   return new Observable((observer) => {
    
//   });
// }

// exports.ChannelList = { getChannelList, listenToUpdatedChannels };
module.exports = getChannelList;

