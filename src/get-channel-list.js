var Observable =  require('rxjs/Rx').Observable;

var flag = false;
// var dbRef = this.db.ref('/users/' + this.user.uid + '/' + this.user.$key + '/messageReceived/');

function getChannelList()
{
 
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
            allChannels.push({
              key: childSnapshot.getKey(),
              value: childSnapshot.val()
            });
          });
          var result = [];
          allChannels.forEach(channel => {
            userChannels.forEach(userChannel => {
              if(userChannel.channelId === channel.key)
              {
                fetchUserInfo(userChannel.member, this)
                .then(userDetails => {
                  result.push({
                    channelId: channel.key, 
                    lastMessage: channel.value.lastMessage, 
                    userDetails
                  });
                  
                  if(result.length === userChannels.length)
                  {
                    result = result.reverse();
                    resolve(result);
                  }
                })
                .catch(err => console.log(err)); 
              }
            })
          })
        });
      }
      else
      {
        reject({ success: false, errMsg: "No Channel exists"});
      }
    })    
  });
}

function fetchUserInfo(otherUserId, self)
{
  return new Promise((resolve, reject) =>{
    var userDetails = {
      uid: '',
      displayName: '',
      displayPhoto: ''
    };
    self.db.ref('/users/' + otherUserId).once('value').then(snapshot => {
    
      snapshot.forEach(childSnapshot => {
    
        userDetails.uid = childSnapshot.val().uid;
        userDetails.displayName = childSnapshot.val().displayName;
        userDetails.displayPhoto = childSnapshot.val().displayPhoto;
      })
      if(userDetails.uid !== '')
      {
        resolve(userDetails);
      }
      else
      {
        reject({success: false, errMsg: "Result not Found"});
      }
    }, err=>reject({success: false, errMsg: "Result not Found"}))
 
  })
  
}

// exports.ChannelList = { getChannelList, listenToUpdatedChannels };
module.exports = getChannelList;

