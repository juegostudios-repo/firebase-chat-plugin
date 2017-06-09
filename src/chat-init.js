function initChat (userId, displayName, displayPhoto)
{
  const userRef = this.db.ref('users/');
  return new Promise((resolve, reject)=>{
    userRef.orderByChild('uid').equalTo(userId).limitToLast(1).once('value')
    .then((snapshot) => {         
      if(snapshot.val()){
        snapshot.forEach((childSnapshot) => {
          this.user = childSnapshot.val();
          this.user.$key = childSnapshot.getKey(); 
          resolve(this.user);
        });
      } else{
        var user={
          uid: userId,
          displayName: displayName ? displayName: "User " + userId,
          displayPhoto: displayPhoto ? displayPhoto : " "
        };
        userRef.push(user)
        .then((pushResponse) => {
          user.$key = pushResponse.key;
          this.user = user;
          resolve(user);
        })
        .catch(err=> reject(err));
      }
    })
    .catch(err=> reject(err));
  });
}

module.exports = initChat;