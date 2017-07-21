
var getChannelIdForUser = require('./get-channelid');

function updateProfilePic(imagePath, channelType, grpId)
{
  if(channelType === 'one2one')
  {
    return updateUserProfilePic(this, imagePath);
  }
  else if(channelType === 'group')
  {
    if(grpId)
    {
      return updateGroupProfilePic(this, imagePath, grpId, channelType)
    }
  }
  else
  {
    console.log("Mention channelType");
  }
}

function updateUserProfilePic(self, imagePath)
{
  var key = self.user.displayPhoto ? self.user.displayPhoto : self.db.ref().push().key;
  return new Promise((resolve, reject)=>{
    getBase64Image(imagePath)
    .then((data)=>{
      return self.db.ref('/file/' + key).set(data);
    })
    .then((done)=>{
      return self.db.ref('/users/'+ self.user.uid + '/displayPhoto').set(key);
    })
    .then((response)=>{
      self.user.displayPhoto = key;
      resolve({success: true, fileKey: key});
    })
    .catch(err=>reject(err));
  });
}

function updateGroupProfilePic(self, imagePath, grpId, channelType)
{
  return new Promise((resolve, reject) => {
    var channelId = getChannelIdForUser(grpId, self.user.channelList, channelType);
    if(channelId)
    {
      var channelRef = self.db.ref('channel/' + channelId + '/groupPic');
      channelRef.once('value')
      .then(groupPicKey => {
        if(groupPicKey.val())
        {
          var key = groupPicKey.val() === ' ' ? self.db.ref().push().key : groupPicKey.val();
          getBase64Image(imagePath)
          .then((data)=>{
            return self.db.ref('/file/' + key).set(data);
          })
          .then((done)=>{
            return self.db.ref('/channel/'+ channelId + '/groupPic').set(key);
          })
          .then((response)=>{
            resolve({success: true, fileKey: key});
          })
          .catch(err=>reject(err));
        }
      })
      .catch(err => {console.log(err)});
    }
    else
    {
      reject({success: false, errMsg: "Group doesn't exist in your channel list."})
    }
  });

}

function getBase64Image(filePath)
{
  return new Promise((resolve, reject)=>
    Jimp.read(filePath)
      .then((image) => {
        image.getBase64(image.getMIME(), (err, res)=>{ 
          if(err){
            reject(err);
          }
          resolve(res);
        });
      })
      .catch((err) => {
          reject(err)
      })
  );
}

module.exports = updateProfilePic;