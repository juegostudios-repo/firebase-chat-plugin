
function getUserDetails(otherUserId)
{
  return new Promise((resolve, reject) => {
    if(otherUserId === this.user.uid)
    {
      reject({success: false, errMsg: "Invalid userID"});
    }
    else
    {
      var userRef = this.db.ref('users/' + otherUserId);
      userRef.once('value')
      .then((snapshot) => {
        if(snapshot.val())
        {
          var userDetails = {
            uid: snapshot.val().uid,
            displayName: snapshot.val().displayName,
            displayPhoto: snapshot.val().displayPhoto,
            channelType: 'one2one'
          };
          resolve(userDetails);
        }
        else
        {
          reject({succes: false, errMsg: "User ID " + otherUserId + " doesn't exists."});
        }
      })
      .catch(err => reject({succes: false, errMsg: "User ID " + otherUserId + " doesn't exists."}))
    }
  })
}

module.exports = getUserDetails;