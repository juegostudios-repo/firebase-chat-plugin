const firebase = require('firebase');



function initChat (userId, displayName, displayPhoto){
  console.log("INNNNit");
  const userRef = this.db.ref('users/');
  return new Promise((resolve, reject)=>{
    userRef.orderByChild('uid').equalTo(userId).limitToLast(1).once('value')
    .then((snapshot) => {         
      if(snapshot.val()){
        snapshot.forEach((childSnapshot) => {
          console.log("User Exist1");
          this.user = childSnapshot.val();
          this.user.$key = childSnapshot.getKey(); 
          resolve(this.user);
        });
      } else{
        console.log("User does not exist1.");
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
};

module.exports = initChat;