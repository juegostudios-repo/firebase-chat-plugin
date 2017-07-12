var Observable =  require('rxjs/Rx').Observable;

var flag = false;
// var dbRef = this.db.ref('/users/' + this.user.uid + '/' + this.user.$key + '/messageReceived/');

function getChannelList()
{
 
  return new Promise((resolve, reject) => {
    this.db.ref('/users/' + this.user.uid + '/channelList/')
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
                //One2One chat
                if(userChannel.member)
                {
                  fetchUserInfo(userChannel.member, this)
                  .then(userDetails => {
                    result.push({
                      channelId: channel.key, 
                      channelType: channel.value.channelName,
                      lastMessage: channel.value.lastMessage, 
                      userDetails
                    });
                    
                    if(result.length === userChannels.length)
                    {
                      result = result.reverse();
                      resolve(result);
                    }
                  })
                  .catch(err => {
                    reject(err);
                  }); 
                }

                //Group chat
                if(userChannel.groupId)
                {
                  fetchGroupInfo(this, userChannel.channelId)
                  .then(userDetails => {
                    result.push({
                      channelId: channel.key, 
                      channelType: channel.value.channelName,
                      lastMessage: channel.value.lastMessage, 
                      userDetails
                    });
                    if(result.length === userChannels.length)
                    {
                      result = result.reverse();
                      resolve(result);
                    }
                  })
                  .catch(err => {
                    reject(err);
                  }); 
                }
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
      userDetails.uid = snapshot.val().uid;
      userDetails.displayName = snapshot.val().displayName;
      userDetails.displayPhoto = snapshot.val().displayPhoto;
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

function fetchGroupInfo(self, channelId)
{
  var userDetails = {
    uid: '',
    displayName: '',
    displayPhoto: ''
  };
  return new Promise((resolve, reject) => {
    self.db.ref('channel/' + channelId).once('value')
    .then(snapshot => {
      if(snapshot.val())
      {
        
        userDetails.uid = snapshot.val().groupId;
        userDetails.displayName = snapshot.val().groupName;
        userDetails.displayPhoto = snapshot.val().groupPic;
        if(userDetails.uid !== '')
        {
          resolve(userDetails);
        }
        else
        {
          reject({success: false, errMsg: "Result not Found"});
        }
      }
    },err=>reject({success: false, errMsg: "Result not Found"}))
  })
  
}

module.exports = getChannelList;

